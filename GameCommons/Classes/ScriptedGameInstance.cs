using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using Commons.Data;
using Commons.DTO;
using Commons.Exceptions;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;
using Commons.Network.WCF;
using GameCommons.Classes.WCF;
using GameCommons.Helpers;
using Noesis.Javascript;
using WebCommons.Classes.Games;
using WebCommons.Enums;
using WebCommons.Services;
using static System.String;

namespace GameCommons.Classes
{
    //TODO Make disabled game instance not accept user commands
    //TODO Clean caches on instance restart
    public class ScriptedGameInstance : IDisposable
    {
        public const string CASINOTV_SERVICE_PROVIDER_ID = "CasinoTV";
        public const string REAL = "Real";
        public const string FUN = "Fun";
        private readonly static TimeSpan INFO_CACHE_PERIOD = TimeSpan.FromMinutes(5);

#if DEBUG
        public const int SHUTDOWN_TIME = 10;
#else
                public const int SHUTDOWN_TIME = 30;
#endif

        private readonly AutoResetEvent readyEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent disposedEvent = new AutoResetEvent(false);
        private readonly object operationsLock = new object();
        private readonly object reloadLock = new object();
        private readonly object delayedCallLock = new object();
        private readonly IDictionary<string, SessionWrapper> sessionWrappers = new Dictionary<string, SessionWrapper>();
        private readonly IList<DelayedTask> delayedTasks = new List<DelayedTask>();
        private readonly List<string> includedFiles = new List<string>();
        private readonly List<string> filesToReload = new List<string>();
        private readonly ScriptedGameWrapper parent;
        private readonly IAccountingFacade accountingFacade;
        private readonly GameInstanceConfiguration instanceMainConfiguration = new GameInstanceConfiguration();
        private readonly IDictionary<string, object> players = new Dictionary<string, object>();
        private readonly IDictionary<string, object> winners = new Dictionary<string, object>();
        private readonly Dictionary<string, object> defaultGameInfo = new Dictionary<string, object>();
        private readonly ConcurrentDictionary<string, Dictionary<string, object>> externalGameInfo = new ConcurrentDictionary<string, Dictionary<string, object>>();
        private readonly Dictionary<string, object> currentGameInfo = new Dictionary<string, object>();
        private VideoStreamData mediaStreamData = new VideoStreamData();
        private readonly string id;
        private readonly string defaultThumbnailUrl;
        private readonly long idLong;
        private readonly string name;
        private readonly GameData gameData;
        private readonly string externalGameUrl;
        private readonly string externalGameSSLUrl;
        private readonly IDictionary<string, object> settings;
        private readonly ILiveReportTracker reportTracker;
        private readonly string cacheKey;
        private Dictionary<string, object> gameConfiguration;
        private JavascriptContext javascriptContext;
        private ScriptedGameContext executionContext;
        private IDictionary<string, object> virtualStreamData;
        private ScriptedGameRuntime runtime;
        private Exception lastException;
        private bool isReady;
        private bool isRunning;
        private GameStateEnum currentStateInternal;
        private GameStateEnum currentState;
        private string stateDescription;
        private string stateInternalDescription;
        private string currentStatus;
        private DateTime? stateEndDate;
        private DateTime? stateInternalEndDate;
        
        public ScriptedGameInstance(ScriptedGameWrapper parent, GameData gameData, string externalGameUrl, string externalGameSSLUrl, IDictionary<string, object> settings, IAccountingFacade accountingFacade, ILiveReportTracker reportTracker)
        {
            this.parent = parent;
            this.gameData = gameData;
            this.externalGameUrl = externalGameUrl;
            this.externalGameSSLUrl = externalGameSSLUrl;
            this.settings = settings;
            this.reportTracker = reportTracker;
            this.accountingFacade = accountingFacade;

            id = gameData.Name.ToLower();
            idLong = gameData.Id;
            name = "{0}\\{1}".FormatString(parent.Id, gameData.Name);
            cacheKey = "CSTVGames_".ConcatString(gameData.Id.ToString(), "_");
            defaultThumbnailUrl = new Uri(externalGameUrl.ConcatString("/_Games/", parent.GameTypeEntity.Name, "/preview.png")).ToString();

            try
            {
                instanceMainConfiguration = gameData.InstanceConfiguration.DeserializeJSON<GameInstanceConfiguration>() ?? instanceMainConfiguration;
            }
            catch (Exception ex)
            {
                parent.LogError(Name, ex);
            }

            try
            {
                currentGameInfo = defaultGameInfo = BaseExternalGameInfoService.Gateway.GetGameInfo(gameData.Id, parent.Id, gameData.Name, 0, 0, 0);
            }
            catch (Exception ex)
            {
                parent.LogError(Name, ex);
            }
        }

        public string Id => id;

        public string IdFull => gameData.Name;

        public long IdLong => idLong;

        public string Name => name;

        public GameInstanceConfiguration InstanceConfiguration => instanceMainConfiguration;

        public GameData GameData => gameData;

        public ScriptedGameWrapper Parent => parent;

        public ScriptedGameRuntime Runtime => runtime;

        public IDictionary<string, SessionWrapper> Sessions => sessionWrappers;

        public string[] SessionIdentifiers
        {
            get
            {
                return sessionWrappers.Where(s => !s.Value.IsServiceSession).Select(s => s.Key).ToArray();
            }
        }

        public Uri ExchangeClientUri => parent.ExchangeClientUri;

        public ITelnetClientService MediaServiceClient => parent.PlayerClientFactory.CreateChannel();

        public VideoStreamData MediaStreamData => mediaStreamData;

        public bool IsDisposing { get; private set; }

        public bool Start()
        {
            try
            {
                parent.Log(Name, "Initializing game instance {0}/{1}.", parent.Id, gameData.Name);
                isRunning = true;
                var thread = new Thread(GameInstanceLoop) { Name = "JS Game host {0}/{1}".FormatString(gameData.Id, gameData.Name) };
                thread.Start();
            }
            catch (Exception ex)
            {
                parent.LogError(Name, ex);
                return false;
            }

            return true;
        }

        public void WaitReady()
        {
            WaitHandle.WaitAny(new WaitHandle[] { readyEvent, disposedEvent });
            if (lastException != null)
            {
                throw lastException;
            }
        }

        public void WaitDispose()
        {
            disposedEvent.WaitOne();
        }

        public void UpdateGameState(GameStateEnum state, string description, DateTime? endDate)
        {
            if (state == GameStateEnum.Disabled || state == GameStateEnum.Enabled)
            {
                currentStateInternal = state;
                stateInternalDescription = description;
                stateInternalEndDate = endDate;
            }
            else
            {
                currentState = state;
                stateDescription = description;
                stateEndDate = endDate;
            }

            switch (state)
            {
                case GameStateEnum.Opened:
                    players.Clear();
                    break;
                case GameStateEnum.Closed:
                    winners.Clear();
                    break;
                case GameStateEnum.Winning:
                    break;
                case GameStateEnum.Disabled:
                    break;
            }

            SerializeStatus();
        }

        public string PostInternal(string sessionId, string message)
        {
            object result = null;
            ExecuteInSync(delegate
            {
                result = javascriptContext.Run("casinotv_callback (\"{0}\", {1});".FormatString(sessionId, message));
            });

            return result.SerializeJSON();
        }

        public string PostSystemInternal(string sessionId, string message)
        {
            object result = null;
            ExecuteInSync(delegate
            {
                var messageData = message.ParseJson();
                if (!messageData.ContainsKey("type"))
                {
                    throw new Exception("Type field is not set.");
                }

                var type = messageData["type"].ToString().ToEnum<SessionMessageTypeEnum>();
                switch (type)
                {
                    case SessionMessageTypeEnum.ProvablyFairClientSeed:
                        var sessionInfo = executionContext.GetSession(sessionId);
                        var userInfo = executionContext.getUserInfo(sessionId);
                        if (sessionInfo != null && userInfo != null)
                        {
                            if (!sessionInfo.HasProvablyFair)
                            {
                                return;
                            }

                            if (!messageData.ContainsKey("seed"))
                            {
                                throw new Exception("Client seed is not set.");
                            }

                            userInfo.rng.playerSeed = messageData["seed"] as string ?? Empty;
                        }
                        break;
                    default:
                        throw new Exception("Unsupported message type.");
                }
            });

            return result.SerializeJSON();
        }

        public void ExecuteRemoteCode(string remoteIp, string code)
        {
            try
            {
                var game = ExternalServiceFacade.GetGameCoreService().GetGameData(gameData.Id);

                if (!game.IsDebug)
                {
                    throw new BusinessException("Game is not in debug mode.");
                }

                Log("Remote code execution by {0} (IP: {1}) of code: \n {2}", Thread.CurrentPrincipal.Identity.Name, remoteIp, code);
                object result = null;
                ExecuteInSync(delegate { result = javascriptContext.Run(code); });

                LogScriptResponse("Result: {0}", result.SerializeJSON());
            }
            catch (JavascriptException ex)
            {
                LogError(ex);
            }
            catch (Exception ex)
            {
                LogError(ex);
            }
        }

        private void ExecuteInSync(Action action, bool ignoreGameStatus = false)
        {
            lock (operationsLock)
            {
                if (IsDisposing && !ignoreGameStatus)
                {
                    throw new Exception("Instance is being stopped.");
                }

                if (!isReady && !ignoreGameStatus)
                {
                    throw new Exception("Instance is busy, please retry.");
                }

                try
                {
                    action();
                }
                catch (Exception ex)
                {
                    LogError(ex);
                    throw;
                }
            }
        }

        public void OverrideRound(string managerId, long? roundId, IDictionary<string, object> data)
        {
            var overrideData = new Dictionary<string, object>
            {
                {"roundId", roundId.HasValue ? (object) roundId.Value : null},
                {"result", data},
            };

            Log("Override round request from manager {0} with data {1}", managerId, overrideData.SerializeJSON());
            runtime.SendServerMessage(ServerMessageTypeEnum.override_round, overrideData);
        }

        public void CancelRound(string managerId, long? roundId)
        {
            var overrideData = new Dictionary<string, object>
            {
                {"roundId", roundId.HasValue ? (object) roundId.Value : null},
            };

            Log($"Cancel round request from manager {managerId}, roundId: {roundId}");
            runtime.SendServerMessage(ServerMessageTypeEnum.cancel_round, overrideData);
        }

        public void CloseRound(string managerId)
        {
            Log("Close round request from manager {0}", managerId);
            runtime.SendServerMessage(ServerMessageTypeEnum.close_round, null);
        }

        public void EnableInstance(string managerId)
        {
            Log(IsNullOrEmpty(managerId) ? $"Enable instance request from system administrator" : $"Enable instance request from manager {managerId}");
            ExecuteInSync(delegate { runtime.enableInstance(); });
        }

        public void DisableInstance(string managerId, int reason)
        {
            Log(IsNullOrEmpty(managerId) ? $"Disable instance request from system administrator with reason {reason}" : $"Disable instance request from manager {managerId} with reason {reason}");

            ExecuteInSync(delegate { runtime.disableInstance($"disabled by {managerId}", reason); });
        }

        public VideoStreamConfig LoadStreamData(long videoStreamId)
        {
            var result = new VideoStreamConfig();

            if (videoStreamId < 1)
            {
                return result;
            }

            var stream = ExternalServiceFacade.GetGameCoreService().GetVideoStreamData(instanceMainConfiguration.VideoStreamId);

            if (stream == null)
            {
                return result;
            }

            mediaStreamData = stream;

            if (!IsNullOrEmpty(stream.VODUrl))
            {
                try
                {
                    Logger.Log("Loading stream configuration...");

                    var random = RandomHelper.Random.Next(100000);
                    var uri = new Uri($"{stream.VODUrl}/config.json?rand1={EnvironmentHelper.CurrentTime.Ticks}&rand2={random}");

                    var config = WebDataManager.GetString(uri).ParseJson();

                    result.VodConfig = config;
                }
                catch (Exception ex)
                {
                    Logger.LogError("Cannot load VOD data", null, ex);
                }
            }

            if (!IsNullOrEmpty(stream.VirtualUrl))
            {
                try
                {
                    Logger.Log("Loading virtual stream data...");

                    var random = RandomHelper.Random.Next(100000);
                    var uri = new Uri($"{stream.VirtualUrl}/config.json?rand1={EnvironmentHelper.CurrentTime.Ticks}&rand2={random}");

                    var config = WebDataManager.GetString(uri).ParseJson();

                    result.VirtualConfig = config;
                }
                catch (Exception ex)
                {
                    Logger.LogError("Cannot load virtual stream data", null, ex);
                }
            }

            result.StreamConfig = stream.StreamConfig;

            return result;
        }

        public void UpdateGameStream()
        {
            ExecuteInSync(delegate
            {
                var videoStreamConfig = LoadStreamData(instanceMainConfiguration.VideoStreamId);

                if (gameConfiguration == null)
                {
                    gameConfiguration = new Dictionary<string, object>();
                }

                gameConfiguration["VOD"] = videoStreamConfig.VodConfig;
                gameConfiguration["Virtual"] = videoStreamConfig.VirtualConfig;

                executionContext.mediaHelper.SetStreamConfig(videoStreamConfig.StreamConfig);
                executionContext.mediaHelper.LoadVOD(videoStreamConfig.VodConfig);
                executionContext.mediaHelper.LoadVirtualData(videoStreamConfig.VirtualConfig);

                virtualStreamData = executionContext.mediaHelper.ExternalVirtualData;
                runtime.SendServerMessage(ServerMessageTypeEnum.reload_vod_data, null);
            });
        }

        private void SerializeStatus()
        {
            var overrideState = currentStateInternal == GameStateEnum.Disabled;
            var gameStatus = new Dictionary<string, object>
            {
                {"state",  overrideState ? currentStateInternal : currentState}, {"description", overrideState ? stateInternalDescription : stateDescription}, {"sessions", sessionWrappers.Count(s => !s.Value.IsServiceSession)}, {"players", players.Values.ToArray()}, {"winners", winners.Values.ToArray()}, {"endDate", overrideState ? stateInternalEndDate : stateEndDate}
            };

            currentStatus = gameStatus.SerializeJSON();
        }

        public void SetPlayerBets(string sessionId, decimal amount)
        {
            if (amount <= 0 && players.ContainsKey(sessionId))
            {
                players.Remove(sessionId);
            }

            if (amount > 0)
            {
                var session = executionContext.GetSession(sessionId);
                if (session != null)
                {
                    var userInfo = session.GetUserInfo(executionContext);
                    players[sessionId] = new Dictionary<string, object>
                    {
                        { "id", userInfo.ExternalId},
                        { "fun", userInfo.isPlayingForFun},
                        { "nick", userInfo.nick},
                        { "amount", amount},
                        { "currency", userInfo.locale.currencySign},
                    };
                }
            }

            SerializeStatus();
        }

        public void SetPlayerWin(string sessionId, decimal amount)
        {
            if (amount > 0)
            {
                var session = executionContext.GetSession(sessionId);
                if (session != null)
                {
                    var userInfo = session.GetUserInfo(executionContext);
                    winners[sessionId] = new Dictionary<string, object>
                    {
                        {"id", userInfo.ExternalId},
                        { "fun", userInfo.isPlayingForFun},
                        { "nick", userInfo.nick},
                        { "amount", amount},
                        { "currency", userInfo.locale.currencySign},
                    };
                }
            }

            SerializeStatus();
        }

        public string GetStatus()
        {
            return currentStatus;
        }

        private void GameInstanceLoop()
        {
            //SetThreadLocale();

            lastException = null;

            disposedEvent.Reset();
            readyEvent.Reset();

            try
            {
                parent.NotifyIstanceAdded(this);
                javascriptContext = JavascriptContextFactory.Create();

                gameConfiguration = null;

                if (gameData.GameConfigurationId != 0)
                {
                    gameConfiguration = ExternalServiceFacade.GetGameCoreService().GetGameConfiguration(gameData.GameConfigurationId).Configuration.ParseJson();
                }

                var videoStreamConfig = LoadStreamData(instanceMainConfiguration.VideoStreamId);

                if (gameConfiguration == null)
                {
                    gameConfiguration = new Dictionary<string, object>();
                }

                gameConfiguration["VOD"] = videoStreamConfig.VodConfig;
                gameConfiguration["Virtual"] = videoStreamConfig.VirtualConfig;

                var hasLiveStream = !(String.IsNullOrWhiteSpace(mediaStreamData.HLSUrl) && String.IsNullOrWhiteSpace(mediaStreamData.RTMPUrl) && String.IsNullOrWhiteSpace(mediaStreamData.MPEGUrl) && String.IsNullOrWhiteSpace(mediaStreamData.WSUrl));

                executionContext = new ScriptedGameContext(this, javascriptContext, gameData, instanceMainConfiguration, gameConfiguration, videoStreamConfig.VodConfig, videoStreamConfig.VirtualConfig, videoStreamConfig.StreamConfig, hasLiveStream, accountingFacade,  reportTracker);
                runtime = new ScriptedGameRuntime(executionContext, reportTracker, parent.ExternalDelay);

                virtualStreamData = executionContext.mediaHelper.ExternalVirtualData;

                javascriptContext.SetParameter("context", executionContext);
                javascriptContext.SetParameter("runtime", runtime);
                LoadFile(parent.EntryFile);
                javascriptContext.Run("casinotv_initialize();");
                SerializeStatus();
                readyEvent.Set();
                while (isRunning)
                {
                    try
                    {
                        lock (operationsLock)
                        {
                            isReady = true;
                            DelayedTask[] tasks;
                            lock (delayedCallLock)
                            {
                                tasks = delayedTasks.Where(t => t.IsTime).ToArray();
                                foreach (var delayedTask in tasks)
                                {
                                    delayedTasks.Remove(delayedTask);
                                }
                            }

                            foreach (var task in tasks)
                            {
                                task.Execute();
                            }

                            runtime.UpdateRuntime();
                            executionContext.ProcessBackground();
                        }
                    }
                    finally
                    {
                        Thread.Sleep(50);
                    }
                }

                lock (operationsLock)
                {
                    javascriptContext.Run("casinotv_terminate();");
                }

                Thread.Sleep(SHUTDOWN_TIME * 1000);
            }
            catch (JavascriptException ex)
            {
                lastException = ex;
                parent.LogScriptError(parent.EntryFile, Name, ex);
                parent.Log(Name, "Instance will be terminated!");
            }
            catch (Exception ex)
            {
                lastException = ex;
                parent.LogError(Name, ex);
                parent.Log(Name, "Instance will be terminated!");
            }
            finally
            {
                isReady = false;

                parent.NotifyIstanceRemoved(this);

                try
                {
                    if (executionContext != null)
                    {
                        executionContext.Dispose();
                        executionContext = null;
                    }
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                }

                try
                {
                    if (runtime != null)
                    {
                        runtime.Dispose();
                        runtime = null;
                    }
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                }

                try
                {
                    if (javascriptContext != null)
                    {
                        javascriptContext.TerminateExecution();
                        javascriptContext = null;
                    }
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                }

                try
                {
                    if (javascriptContext != null)
                    {
                        javascriptContext.Dispose();
                        javascriptContext = null;
                    }
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                }

                try
                {
                    lock (operationsLock)
                    {
                        foreach (var wrapper in sessionWrappers)
                        {
                            wrapper.Value.MarkJunk(id);
                        }

                        sessionWrappers.Clear();
                    }
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                }

                disposedEvent.Set();
            }
        }

        public string GetGameInfo(bool isSecureRequest)
        {
            if (!isReady)
            {
                throw new BusinessException("Game is temporary offline, please standby, it'll be back shortly.");
            }

            var cacheKey = $"gameInfo_{gameData.Id}_{isSecureRequest}";
            var gameInfo = CacheHelper.GetCache<string>(cacheKey);

            if (!IsNullOrEmpty(gameInfo))
            {
                return gameInfo;
            }

            var videoStreamId = instanceMainConfiguration.VideoStreamId;

            var clientConfiguration = new BaseGameConfiguration();
            try
            {
                if (videoStreamId > 0)
                {
                    if (mediaStreamData != null)
                    {
                        var url = FixUrl(currentGameInfo.Evaluate<string>(BaseExternalGameInfoService.RULES_URL), isSecureRequest);
                        clientConfiguration = new BaseGameConfiguration(mediaStreamData.RTMPUrl, mediaStreamData.HLSUrl.FixUrl(isSecureRequest), mediaStreamData.MPEGUrl.FixUrl(isSecureRequest), mediaStreamData.WSUrl.FixUrl(isSecureRequest), mediaStreamData.VODUrl.FixUrl(isSecureRequest), mediaStreamData.VirtualUrl.FixUrl(isSecureRequest), mediaStreamData.StreamConfig, virtualStreamData, url);
                    }
                }

                CacheHelper.AddCache(cacheKey, gameInfo = clientConfiguration.SerializeJSON());
            }
            catch (Exception ex)
            {
                Logger.Log(ex);
            }

            return gameInfo;
        }

        public void LoadFile(string file)
        {
            LoadData(file.ReadAllTextFromFile(), file);
        }

        public void LoadData(string data, string file)
        {
            javascriptContext.Run(data, file.SubtractPath(Path.GetDirectoryName(parent.EntryFile)).TrimStart('/', '\\'));
        }

        public void CheckAvailability()
        {
            if (runtime != null && runtime.IsDisabled)
            {
                throw new BusinessException("Sorry, this game is not available at this time, please retry later");
            }
        }

        public JoinGameData JoinGame(SessionWrapper sessionWrapper, string gameInstanceId, string clientId, bool isSecureRequest)
        {
            CheckAvailability();

            UserInfo userInfo;
            lock (operationsLock)
            {
                var hasError = false;
                try
                {
                    if (!isReady)
                    {
                        throw new BusinessException("GAME_INSTANCE_BUSY");
                    }

                    if (IsDisposing)
                    {
                        throw new BusinessException("GAME_INSTANCE_STOPPING");
                    }

                    sessionWrapper.ResetStream(id);

                    var isOldSession = sessionWrappers.ContainsKey(sessionWrapper.SessionId);
                    if (!isOldSession)
                    {
                        sessionWrappers.Add(sessionWrapper.SessionId, sessionWrapper);
                    }

                    sessionWrapper.SetClientId(id, clientId);
                    sessionWrapper.SetInstanceId(id, gameInstanceId);

                    executionContext?.RegisterSession(sessionWrapper);

                    userInfo = sessionWrapper.GetUserInfo(executionContext);

                    Log("SYSTEM: Joining user with ID {0}, casinoId {1}, sessionId {2} (oldSessionFlag set to {3})".FormatString(sessionWrapper.UserId, sessionWrapper.CasinoId, sessionWrapper.SessionId, isOldSession));
                    javascriptContext.Run("casinotv_join(\"{0}\", {1});".FormatString(sessionWrapper.SessionId, isOldSession.ToString().ToLower()));

                    runtime?.RegisterNewSession(sessionWrapper);
                }
                catch (JavascriptException ex)
                {
                    hasError = true;
                    parent.LogScriptError(parent.EntryFile, Name, ex);
                    throw;
                }
                catch (Exception ex)
                {
                    hasError = true;
                    parent.LogError(Name, ex);
                    throw;
                }
                finally
                {
                    if (hasError && sessionWrappers.ContainsKey(sessionWrapper.SessionId))
                    {
                        sessionWrappers.Remove(sessionWrapper.SessionId);
                        sessionWrapper.ReleaseStream(gameInstanceId);
                    }
                }
            }

            SerializeStatus();

            return new JoinGameData(new ExternalGameData(FixUrl(externalGameUrl, isSecureRequest), sessionWrapper.SessionToken), new ExternalGameUserData(userInfo.locale.language, userInfo.locale.currencySign, userInfo.locale.currency, userInfo.locale.currencyMultiplier, sessionWrapper.Features));
        }

        public JoinGameData JoinWatchGame(SessionWrapper sessionWrapper, string gameInstanceId, bool isSecureRequest)
        {
            if (runtime != null && runtime.IsDisabled)
            {
                throw new Exception("Sorry, this game is not available at this time, please retry later");
            }

            lock (operationsLock)
            {
                var hasError = false;
                try
                {
                    if (!isReady)
                    {
                        throw new BusinessException("GAME_INSTANCE_BUSY");
                    }

                    if (IsDisposing)
                    {
                        throw new BusinessException("GAME_INSTANCE_STOPPING");
                    }

                    sessionWrapper.ResetStream(id);

                    var isOldSession = sessionWrappers.ContainsKey(sessionWrapper.SessionId);
                    if (!isOldSession)
                    {
                        sessionWrappers.Add(sessionWrapper.SessionId, sessionWrapper);
                    }

                    sessionWrapper.SetInstanceId(id, gameInstanceId);
                    executionContext?.RegisterSession(sessionWrapper);

                    Log("SYSTEM: Joining watch with sessionId {0}".FormatString(sessionWrapper.SessionId));

                    runtime?.RegisterNewSession(sessionWrapper);
                }
                catch (JavascriptException ex)
                {
                    hasError = true;
                    parent.LogScriptError(parent.EntryFile, Name, ex);
                    throw;
                }
                catch (Exception ex)
                {
                    hasError = true;
                    parent.LogError(Name, ex);
                    throw;
                }
                finally
                {
                    if (hasError && sessionWrappers.ContainsKey(sessionWrapper.SessionId))
                    {
                        sessionWrappers.Remove(sessionWrapper.SessionId);
                        sessionWrapper.ReleaseStream(gameInstanceId);
                    }
                }
            }

            return new JoinGameData(new ExternalGameData(FixUrl(externalGameUrl, isSecureRequest), sessionWrapper.SessionToken), null);
        }

        public bool Leave(SessionWrapper sessionWrapper)
        {
            if (sessionWrapper == null)
            {
                return false;
            }

            lock (operationsLock)
            {
                try
                {
                    if (sessionWrappers.ContainsKey(sessionWrapper.SessionId))
                    {
                        if (sessionWrapper.IsServiceSession)
                        {
                            Log("SYSTEM: Watch with sessionID {0} is leaving".FormatString(sessionWrapper.SessionId));

                            executionContext?.UnregisterSession(sessionWrapper);

                            sessionWrappers.Remove(sessionWrapper.SessionId);
                            sessionWrapper.ReleaseStream(Id);
                            return true;
                        }

                        Log("SYSTEM: User with sessionID {0} is leaving".FormatString(sessionWrapper.SessionId));
                        javascriptContext.Run("casinotv_leave(\"{0}\");".FormatString(sessionWrapper.SessionId));

                        executionContext?.UnregisterSession(sessionWrapper);

                        sessionWrappers.Remove(sessionWrapper.SessionId);
                        sessionWrapper.ReleaseStream(Id);
                        SerializeStatus();
                        return true;
                    }
                }
                catch (JavascriptException ex)
                {
                    parent.LogScriptError(parent.EntryFile, Name, ex);
                }
                catch (Exception ex)
                {
                    parent.LogError(Name, ex);
                    throw;
                }
            }

            SerializeStatus();
            return false;
        }

        public void Log(string message, params object[] parameters)
        {
            if (parameters != null && parameters.Length > 0)
            {
                message = message.FormatString(parameters);
            }

            parent.LogScriptMessage(parent.EntryFile, Name, message);
        }

        public void LogScriptResponse(string message, params object[] parameters)
        {
            if (parameters != null && parameters.Length > 0)
            {
                message = message.FormatString(parameters);
            }

            parent.LogScriptResponse(parent.EntryFile, Name, message);
        }

        public void Debug(string message)
        {
            parent.LogScriptMessage(parent.EntryFile, Name, message);
        }

        public void LogError(Exception ex, string source = null)
        {
            if (ex is JavascriptException)
            {
                parent.LogScriptError(parent.EntryFile, Name, ex as JavascriptException, source);
            }
            else
            {
                parent.LogError(source ?? Name, ex);
            }
        }

        public void LogError(string message, string source = null)
        {
            parent.LogError(source ?? Name, message);
        }

        public void AddIncludedFile(string includedFile)
        {
            includedFile = includedFile.ToLower();
            lock (reloadLock)
            {
                if (!includedFiles.Contains(includedFile))
                {
                    includedFiles.Add(includedFile);
                }
            }
        }

        public void AddDelayedCall(DelayedTask delayedTask)
        {
            lock (delayedCallLock)
            {
                delayedTasks.Add(delayedTask);
            }
        }

        public void RemovedDelayedCall(string callId)
        {
            lock (delayedCallLock)
            {
                var task = delayedTasks.FirstOrDefault(t => t.Id.EqName(callId));
                if (task != null)
                {
                    delayedTasks.Remove(task);
                }
            }
        }

        public void RemovedDelayedCalls()
        {
            lock (delayedCallLock)
            {
                delayedTasks.Clear();
            }
        }

        public void RunInSync(Action action, bool ignoreGameStatus = false)
        {
            ExecuteInSync(action, ignoreGameStatus: ignoreGameStatus);
        }

        public void ExecuteCallback(object sender, object callback, bool returnExceptions, params object[] param)
        {
            if (callback == null)
            {
                return;
            }

            ExecuteInSync(delegate {

                if (callback is IntPtr)
                {
                    try
                    {
                        javascriptContext.Call((IntPtr)callback, param);
                    }
                    catch (JavascriptException ex)
                    {
                        LogError(ex);
                        if (returnExceptions)
                        {
                            ex.RethrowException();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogError(ex);
                        if (returnExceptions)
                        {
                            ex.RethrowException();
                        }
                    }

                    return;
                }

                var callbackString = callback.ToString();

                if (!IsNullOrEmpty(callbackString))
                {
                    try
                    {
                        javascriptContext.SetParameter("_callSender", sender);
                        var paramsList = new StringBuilder();
                        for (var i = 0; i < param.Length; i++)
                        {
                            javascriptContext.SetParameter("_callParam{0}".FormatString(i), param[i]);
                            paramsList.Append("_callParam{0}".FormatString(i));
                            if (i > 0)
                            {
                                paramsList.Append(", ");
                            }
                        }

                        if (callbackString.Contains('{'))
                        {
                            var positionStart = callbackString.IndexOf('(') + 1;
                            var positionEnd = callbackString.IndexOf(')') - 1;
                            if (positionEnd > positionStart)
                            {
                                callbackString = callbackString.Remove(positionStart, positionEnd - positionStart);
                            }

                            callbackString = callbackString.Insert(positionStart, paramsList.ToString());
                        }
                        else
                        {
                            callbackString = "{0}({1});".FormatString(callbackString.TrimEnd(';', '(', ')'), paramsList);
                        }

                        javascriptContext.Run(callbackString);
                    }
                    catch (JavascriptException ex)
                    {
                        LogError(ex, callbackString.Truncate(250));
                    }
                    catch (Exception ex)
                    {
                        LogError(ex, callbackString.Truncate(250));
                    }
                }

            });
        }

        public void ReloadFile(string reloadFile)
        {
            reloadFile = reloadFile.ToLower();
            lock (reloadLock)
            {
                if (includedFiles.Contains(reloadFile) && !filesToReload.Contains(reloadFile))
                {
                    filesToReload.Add(reloadFile);
                }
            }
        }

        public void CleanupMessages()
        {
            foreach (var sessionWrapper in sessionWrappers.Values.ToArray())
            {
                try
                {
                    sessionWrapper.CleanupMessages(Id, TimeSpan.FromSeconds(10));
                }
                catch (Exception ex)
                {
                    Logger.Log(ex);
                }
            }
        }

        public void Dispose(bool isRestarting)
        {
            IsDisposing = true;
            parent.Log(Name, "Terminating instance...");
            isRunning = false;
            try
            {
                if (runtime != null)
                {
                    if (isRestarting)
                    {
                        runtime.NotifyRestart(SHUTDOWN_TIME);
                    }
                    else
                    {
                        runtime.NotifyShutdown(SHUTDOWN_TIME);
                    }
                }
            }
            catch
            {
            }
        }

        public void Dispose()
        {
            Dispose(false);
        }

        private static string GetLoaderUrl(string webSiteUrl, string gameId, string instanceId, string clientId)
        {
            instanceId = IsNullOrEmpty(instanceId) ? null : Concat("?gameId=", instanceId.EscapeUrlParameter());
            var clientUrlIdentifier = Empty;
            if (!IsNullOrEmpty(clientId))
            {
                clientUrlIdentifier = clientId.EscapeUrlParameter();
                clientId = Concat("clients/", clientId.EscapeUrlParameter(), "/");
            }

            return Concat(webSiteUrl.TrimEnd('/'), "/_Games/", gameId.EscapeUrlParameter(), "/", clientId, "index.html", instanceId, "&clientId=", clientUrlIdentifier);
        }

        private GameData GetGame()
        {
            return ExternalServiceFacade.GetGameCoreService().GetGameData(gameData.Id);
        }

        private GameInstanceConfiguration GetConfig(GameData game)
        {
            try
            {
                return game.InstanceConfiguration.DeserializeJSON<GameInstanceConfiguration>() ?? instanceMainConfiguration;
            }
            catch (Exception ex)
            {
                parent.LogError(Name, ex);
            }

            return instanceMainConfiguration;
        }

        private Dictionary<string, IDictionary<string, CasinoTvExternalGameLayoutInfo>> GetLayouts()
        {
            var layouts = new Dictionary<string, IDictionary<string, CasinoTvExternalGameLayoutInfo>>();
            try
            {
                var gameConfig = parent.GetClientConfig().ParseJson();
                if (gameConfig != null)
                {
                    foreach (var config in gameConfig)
                    {
                        var configValue = (config.Value as IDictionary<string, object>);
                        if (configValue != null && configValue.ContainsKey("layout"))
                        {
                            var layoutsCollection = configValue["layout"] as IDictionary<string, object>;
                            if (layoutsCollection != null)
                            {
                                layouts[config.Key.ToLower()] = layoutsCollection.ToDictionary(c => c.Key, c => c.Value.SerializeJSON().DeserializeJSON<CasinoTvExternalGameLayoutInfo>());
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                parent.LogError(Name, ex);
            }

            return layouts;
        }

        public CasinoTvExternalGame GetGameData(string webSiteUrl, string clientId, long casinoId, long userId, long referenceId, bool isSecureRequest, Dictionary<string, object> externalData)
        {
            var game = CacheHelper.GetCache<GameData>(cacheKey.ConcatString("game"));
            if (game == null)
            {
                CacheHelper.AddCache(cacheKey.ConcatString("game"), game = GetGame(), INFO_CACHE_PERIOD);
            }

            var instanceConfig = CacheHelper.GetCache<GameInstanceConfiguration>(cacheKey.ConcatString("config"));
            if (instanceConfig == null)
            {
                CacheHelper.AddCache(cacheKey.ConcatString("config"), instanceConfig = GetConfig(game), INFO_CACHE_PERIOD);
            }

            var layouts = CacheHelper.GetCache<Dictionary<string, IDictionary<string, CasinoTvExternalGameLayoutInfo>>>(cacheKey.ConcatString("layouts"));
            if (layouts == null)
            {
                CacheHelper.AddCache(cacheKey.ConcatString("layouts"), layouts = GetLayouts(), INFO_CACHE_PERIOD);
            }

            var externalInfo = externalData;
            var path = "{0}_{1}".FormatString(casinoId, referenceId);
            var extInfoCacheKey = cacheKey.ConcatString("_ext_info", path);
            if (externalInfo == null)
            {
                if (userId == 0)
                {
                    try
                    {

                        externalGameInfo[path] = CacheHelper.GetCache<Dictionary<string, object>>(extInfoCacheKey);
                        if (externalGameInfo[path] == null)
                        {
                            CacheHelper.AddCache(extInfoCacheKey, externalGameInfo[path] = BaseExternalGameInfoService.Gateway.GetGameInfo(gameData.Id, parent.Id, game.Name, casinoId, userId, referenceId), INFO_CACHE_PERIOD);
                        }
                    }
                    catch (Exception ex)
                    {
                        parent.LogError(Name, ex);
                    }

                    externalInfo = externalGameInfo.ContainsKey(path) ? externalGameInfo[path] : defaultGameInfo;
                }
                else
                {
                    try
                    {
                        externalInfo = BaseExternalGameInfoService.Gateway.GetGameInfo(gameData.Id, parent.Id, game.Name, casinoId, userId, referenceId);
                    }
                    catch (Exception ex)
                    {
                        parent.LogError(Name, ex);
                        externalInfo = externalGameInfo.ContainsKey(path) ? externalGameInfo[path] : defaultGameInfo;
                    }
                }
            }
            else
            {
                CacheHelper.AddCache(extInfoCacheKey, externalGameInfo[path] = externalInfo, INFO_CACHE_PERIOD);
            }

            externalInfo = externalInfo ?? new Dictionary<string, object>();

            clientId = (clientId ?? instanceConfig.ClientId ?? Empty);
            var configClientId = clientId.ToLower();

            IDictionary<string, CasinoTvExternalGameLayoutInfo> availableLayouts = null;

            if (layouts != null && layouts.ContainsKey(configClientId))
            {
                availableLayouts = layouts[configClientId];
            }

            if (availableLayouts == null || !availableLayouts.ContainsKey("default"))
            {
                if (availableLayouts == null)
                {
                    availableLayouts = new Dictionary<string, CasinoTvExternalGameLayoutInfo>();
                }

                if (!availableLayouts.ContainsKey("default"))
                {
                    availableLayouts["default"] = new CasinoTvExternalGameLayoutInfo { AspectRatio = "16x9", Direction = ExternalGameDirectionTypeEnum.Portrait };
                }

                if (!availableLayouts.ContainsKey("mobile"))
                {
                    availableLayouts["mobile"] = new CasinoTvExternalGameLayoutInfo { AspectRatio = "9x16", Direction = ExternalGameDirectionTypeEnum.PortraitLandscape };
                }
            }

            var category = parent.GameTypeEntity.Name;
            switch (parent.GameTypeEntity.SubType)
            {
                case GameTypeSubTypeEnum.Default:
                case GameTypeSubTypeEnum.Dice:
                    category = "other games";
                    break;
            }

            var thumbnailUrl = FixUrl(externalInfo.Evaluate<string>(BaseExternalGameInfoService.THUMBNAIL_URL), isSecureRequest).FixUrl(isSecureRequest);
            var backgroundUrl = FixUrl(externalInfo.Evaluate<string>(BaseExternalGameInfoService.BACKGROUND_URL), isSecureRequest).FixUrl(isSecureRequest);
            var featureUrl = FixUrl(externalInfo.Evaluate<string>(BaseExternalGameInfoService.FEATURED_URL), isSecureRequest).FixUrl(isSecureRequest);
            var introVideoUrl = FixUrl(externalInfo.Evaluate<string>(BaseExternalGameInfoService.INTRO_VIDEO_URL), isSecureRequest).FixUrl(isSecureRequest);

            if (IsNullOrEmpty(thumbnailUrl))
            {
                thumbnailUrl = FixUrl(defaultThumbnailUrl, isSecureRequest);
            }

            return new CasinoTvExternalGame(gameData.Id, parent.GameTypeEntity.Name, gameData.Name, gameData.Title, gameData.Description, thumbnailUrl, new[] { new CasinoTvExternalGameMode(FUN, FUN, FUN), new CasinoTvExternalGameMode(REAL, REAL, REAL) }) { Tags = instanceConfig.Tags, AvailableLayouts = availableLayouts, RefId = gameData.Name, Category = category, ClientId = clientId, LoaderUrl = GetLoaderUrl(webSiteUrl, parent.GameTypeEntity.Name, gameData.Name, clientId), BackgroundUrl = backgroundUrl, FeaturedUrl = featureUrl, IntroVideoUrl = introVideoUrl };
        }

        private string FixUrl(string url, bool isSecureRequest)
        {
            if (IsNullOrEmpty(url))
            {
                return url;
            }

            url = isSecureRequest 
                ? url.Replace(externalGameUrl, externalGameSSLUrl) 
                : url.Replace(externalGameSSLUrl, externalGameUrl);

            return url;
        }

        public T GetInstanceSetting<T>(string settingName, T defaultValue)
        {
            return settings.Evaluate(settingName, defaultValue);
        }
    }
}