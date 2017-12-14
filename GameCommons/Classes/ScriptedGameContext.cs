using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using Commons.DTO;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;
using Noesis.Javascript;
using WebCommons.Classes.Games;
using WebCommons.Services;

namespace GameCommons.Classes
{
    public class ScriptedGameContext : IDisposable
    {
        private readonly object delayLocker = new object();
        private readonly object datasourceLock = new object();
        private readonly IDictionary<string, ExternalDatasource> datasources = new Dictionary<string, ExternalDatasource>();
        private readonly ScriptedGameInstance game;
        private readonly JavascriptContext javascriptContext;
        private readonly GameData gameData;
        private readonly GameInstanceConfiguration gameInstanceConfiguration;
        private readonly object gameSpecificConfiguration;
        private readonly IAccountingFacade accountingFacade;
        private readonly ILiveReportTracker reportTracker;
        private bool isDisposed;
        
        public ScriptedGameContext(ScriptedGameInstance game, JavascriptContext javascriptContext, GameData gameData, GameInstanceConfiguration instanceConfiguration, object gameConfiguration, IDictionary<string, object> vodData, IDictionary<string, object> virtualData, IDictionary<string, object> streamConfig, bool hasLiveStreams, IAccountingFacade accountingFacade, ILiveReportTracker reportTracker)
        {
            this.game = game;
            this.javascriptContext = javascriptContext;
            this.gameData = gameData;
            gameInstanceConfiguration = instanceConfiguration;
            gameSpecificConfiguration = gameConfiguration;
            this.reportTracker = reportTracker;
            this.accountingFacade = accountingFacade;
            mediaHelper = new GameMediaHelper(this, vodData, virtualData, streamConfig, hasLiveStreams);
            storageHelper = new StorageHelper(game.IdLong.ToString(), this);
            rng = new RNGWrapper(this, null);
            roundCounter = new RoundCounter(this);
            accountingHelper = new AccountingHelper(this, accountingFacade, reportTracker, instanceConfiguration.TrackFunData);
        }

        public bool IsDisposed => isDisposed;

        public ScriptedGameInstance Game => game;

        public GameInstanceConfiguration instanceConfiguration => gameInstanceConfiguration;

        public object gameConfiguration => gameSpecificConfiguration;

        public DateTime date => EnvironmentHelper.CurrentTime;

        public String getUID()
        {
            return Guid.NewGuid().ToString();
        }

        public string[] sessions
        {
            get { return game.SessionIdentifiers.Select(c => c.ToString()).ToArray(); }
        }

        public GameMediaHelper mediaHelper { get; private set; }

        public StorageHelper storageHelper { get; private set; }

        public AccountingHelper accountingHelper { get; private set; }

        public RoundCounter roundCounter { get; private set; }

        public RNGWrapper rng { get; private set; }

        public IAccountingFacade AccountingFacade => accountingFacade;

        public void include(string file)
        {
            var fullFilename = Path.GetDirectoryName(game.Parent.EntryFile).CombinePath(file.ToSafePath()).ToFullPath();
            if (!File.Exists(fullFilename))
            {
                throw new FileNotFoundException("File '{0}' was not found.".FormatString(file));
            }

            try
            {
                game.AddIncludedFile(fullFilename);
                game.LoadFile(fullFilename);
            }
            catch (Exception ex)
            {
                game.LogError(ex, file);
                throw;
            }
        }

        public string setTimeout(object jsFunction, string delay)
        {
            var id = Guid.NewGuid().ToString();
            game.AddDelayedCall(new DelayedTask(game, this, javascriptContext, id, jsFunction, delay.ToDouble()));
            return id;
        }

        public void clearTimeout(string id)
        {
            game.RemovedDelayedCall(id);
        }

        public void clearTimeouts()
        {
            game.RemovedDelayedCalls();
        }

        public void log(object message)
        {
            game.Log(ConvertToString(message));
        }

        public void log(object message1, object message2)
        {
            log(new []{message1, message2});
        }

        public void log(object[] messages)
        {
            game.Log(messages == null ? "null" : messages.Select(ConvertToString).JoinString(String.Empty));
        }

        public void debug(object message)
        {
            game.Debug(ConvertToString(message));
        }

        public void debug(object message1, object message2)
        {
            debug(new[] { message1, message2 });
        }

        public void debug(object[] messages)
        {
            game.Debug(messages == null ? "null" : messages.Select(ConvertToString).JoinString(String.Empty));
        }
        
        public void logError(object error)
        {
            if (error is JavascriptException)
            {
                game.LogError((JavascriptException) error);
            }
            else if (error is Exception)
            {
                game.LogError((Exception) error);
            }
            else
            {
                game.LogError(ConvertToString(error));
            }
        }

        public void logError(object error1, object error2)
        {
            logError(new []{error1, error2});
        }

        public void logError(object[] messages)
        {
            if (messages == null)
            {
                game.LogError(new Exception("null"));
                return;
            }

            if (messages.Length > 0 && messages[0] is JavascriptException)
            {
                game.LogError(messages[0] as JavascriptException);
            }
            else
            {
                game.LogError(new Exception(messages.Select(ConvertToString).JoinString(String.Empty)));    
            }
        }

        public object loadSettings()
        {
            try
            {
                return ExternalServiceFacade.GetGameCoreService().GetGameSettings(gameData.Id).ParseJsonAny();
            }
            catch (Exception ex)
            {
                Logger.Log(ex, game.Id);
            }

            return null;
        }

        public bool saveSettings(object settings)
        {
            try
            {
                ExternalServiceFacade.GetGameCoreService().SaveGameSettings(gameData.Id, settings.SerializeJSON());
                return true;
            }
            catch (Exception ex)
            {
                Logger.Log(ex, game.Id);
            }

            return false;
        }
       
        public void sendAll(object data)
        {
            var sessions = game.Sessions.Values.ToArray();
            var serializedData = Serialize(data);
            foreach (var sessionWrapper in sessions)
            {
                sessionWrapper.AddOutputMessage(game.Id, serializedData);
            }
        }

        public void send(string sessionId, object data)
        {
            var session = GetSession(sessionId);
            session?.AddOutputMessage(game.Id, Serialize(data));
        }

        public void sendSystemAll(string type, object data)
        {
            sendSystemAllInternal(type.ToEnum<SessionMessageTypeEnum>(), data);
        }

        public void sendSystem(string sessionId, string type, object data)
        {
            sendSystemInternal(sessionId, type.ToEnum<SessionMessageTypeEnum>(), data);
        }

        internal void sendSystemAllInternal(SessionMessageTypeEnum type, object data)
        {
            var sessions = game.Sessions.Values.ToArray();
            var serializedData = Serialize(data);

            foreach (var sessionWrapper in sessions)
            {
                sessionWrapper.AddOutputMessage(game.Id, serializedData, type);
            }
        }

        internal void sendSystemInternal(string sessionId, SessionMessageTypeEnum type, object data)
        {
            var session = GetSession(sessionId);
            if (session != null)
            {
                switch (type)
                {
                    case SessionMessageTypeEnum.ProvablyFairClientSeed:
                    case SessionMessageTypeEnum.ProvablyFairServerHash:
                    case SessionMessageTypeEnum.ProvablyFairServerSecret:
                        if (!session.HasProvablyFair)
                        {
                            return;
                        }
                        break;
                }

                var serializedData = Serialize(data);
                session.AddOutputMessage(game.Id, serializedData, type);
            }
        }

        public string getSessionId(long userId, long casinoId)
        {
            return game.Sessions.Values.Where(s => s.CasinoId == casinoId && s.UserId == userId).Select(s => s.SessionId).FirstOrDefault();
        }

        public void cleanupMessages()
        {
            game.CleanupMessages();
        }

        public object getExchangeData()
        {
            var id = instanceConfiguration.DataExchangeId.Trim();
            if (String.IsNullOrEmpty(id))
            {
                throw new Exception("Default data exchange id is not set.");
            }

            return getExchangeData(id);
        }

        public object getExchangeData(string id)
        {
            return GetDataSource(id);
        }

        public UserInfo getUserInfo(string sessionId)
        {
            var session = GetSession(sessionId);
            return session?.GetUserInfo(this) ?? accountingHelper.GetUserInfo(sessionId);
        }

        public CasinoInfo getCasinoInfo(string sessionId)
        {
            var session = GetSession(sessionId);
            if (session == null)
            {
                return null;
            }

            return ExternalServiceFacade.GetGameCoreService().GetCasino(session.CasinoId);
        }

        public object loadUserSettings(string sessionId)
        {
            var session = GetSession(sessionId);
            if (session != null)
            {
                var userId = session.UserId;
                if (userId != 0)
                {
                    try
                    {
                        return ExternalServiceFacade.GetGameCoreService().GetGameUserSettings(gameData.Id, userId).ParseJsonAny();
                    }
                    catch (Exception ex)
                    {
                        Logger.Log(ex, game.Id);
                    }
                }
                else
                {
                    return session.getLocalSettings(gameData.Id);
                }

                return null;
            }

            return null;
        }

        public bool saveUserSettings(string sessionId, object settings)
        {
            var session = GetSession(sessionId);
            if (session != null)
            {
                var userId = session.UserId;
                if (userId != 0)
                {
                    try
                    {
                        ExternalServiceFacade.GetGameCoreService().SaveGameUserSettings(gameData.Id, userId, settings.SerializeJSON());
                        return true;
                    }
                    catch (Exception ex)
                    {
                        Logger.Log(ex, game.Id);
                    }
                }
                else
                {
                    session.setLocalSettings(gameData.Id, settings);
                    return true;
                }
            }

            return false;
        }

        public void keepSessionAlive(string sessionId)
        {
            RegisterSessionActivity(sessionId);
        }

        public void kick(string sessionId)
        {
            game.Leave(GetSession(sessionId));
        }

        public void sendMediaCommand(string command)
        {
            try
            {
                var id = instanceConfiguration.MediaServerId.Trim();
                if (String.IsNullOrEmpty(id))
                {
                    return;
                }

                sendMediaCommandToServer(id, command, null);
            }
            catch (Exception ex)
            {
                game.LogError(ex, command);
            }
        }

        public void sendMediaCommand(string command, object data)
        {
            try
            {
                var id = instanceConfiguration.MediaServerId.Trim();
                if (String.IsNullOrEmpty(id))
                {
                    return;
                }

                sendMediaCommandToServer(id, command, data);
            }
            catch (Exception ex)
            {
                game.LogError(ex, command);
            }
        }

        public void sendMediaCommandToServer(string id, string command)
        {
            sendMediaCommandToServer(id, command, null);
        }

        public void sendMediaCommandToServer(string id, string command, object data)
        {
            try
            {
                command = command.TrimEnd(';', ')', '(');
                var param = String.Empty;
                if (data != null)
                {
                    param = ConvertToMediaMixerFormat(data, true);
                }

                game.MediaServiceClient.Send(id, String.Concat(command, "(", param, ");"));
            }
            catch (Exception ex)
            {
                game.LogError(ex, ConvertToString(command));
            }
        }

        private string Serialize(object data)
        {
            return data.SerializeJSON();
        }

        private ExternalDatasource GetDataSource(string id)
        {
            id = id.ToLower();
            lock (datasourceLock)
            {
                if (!datasources.ContainsKey(id))
                {
                    datasources.Add(id, new ExternalDatasource(this, game.ExchangeClientUri, id));
                }
            }

            return datasources[id];
        }

        internal SessionWrapper GetSession(string sessionId)
        {
            try
            {
                if (String.IsNullOrEmpty(sessionId))
                {
                    return null;
                }

                if (game.Sessions.ContainsKey(sessionId))
                {
                    return game.Sessions[sessionId];
                }
            }
            catch (Exception ex)
            {
                Game.LogError(ex);
            }

            return null;
        }

        private string ConvertToString(object message)
        {
            if (message == null)
            {
                return null;
            }

            if (message is string)
            {
                return message as string;
            }

            return message.SerializeJSON();
        }

        private string ConvertToMediaMixerFormat(object data, bool isFirst)
        {
            if (data is IEnumerable<object>)
            {
                return isFirst ? String.Join(", ", (data as IEnumerable<object>).Select(a => ConvertToMediaMixerFormat(a, false)).ToArray()) : String.Concat("[", String.Join(", ", (data as IEnumerable<object>).Select(a => ConvertToMediaMixerFormat(a, false)).ToArray()), "]");
            }

            return String.Concat("\"", (data.ToString().Replace("\\", "\\\\").Replace("\"", "\\\"")), "\"");
        }

        internal void RegisterSession(SessionWrapper session)
        {
            mediaHelper?.RegisterSession(session.SessionId);
            accountingHelper?.RegisterSession(session.SessionId);
        }

        internal void UnregisterSession(SessionWrapper session)
        {
            mediaHelper?.UnregisterSession(session.SessionId);
            var userInfo = session.GetUserInfo(this);
            if (userInfo != null)
            {
                reportTracker.Clear(game.IdLong, userInfo.UserId);
            }
        }

        public void ProcessBackground()
        {
            foreach (var datasource in datasources.Values.ToArray())
            {
                try
                {
                    datasource.Process();
                }
                catch (Exception ex)
                {
                    game.LogError(ex);
                }
            }
        }

        public void RegisterSessionActivity(string sessionId)
        {
            var session = GetSession(sessionId);
            session?.RegisterUserActivity(game.Id);
        }

        public void SetSessionActivityTimeout(string sessionId, int timeout)
        {
            if (String.IsNullOrEmpty(sessionId))
            {
                var sessions = game.Sessions.Values.ToArray();
                foreach (var session in sessions)
                {
                    session.SetUserActivityTimeout(game.Id, timeout);
                }
            }
            else
            {
                var session = GetSession(sessionId);
                session?.SetUserActivityTimeout(game.Id, timeout);
            }
        }

        public void Dispose()
        {
            lock (delayLocker)
            {
                Thread.Sleep(100);
                isDisposed = true;
            }

            foreach (var datasource in datasources)
            {
                datasource.Value.Dispose();
            }

            datasources.Clear();
            try
            {
                storageHelper.Dispose();
            }
            catch
            {
            }
        }
    }
}