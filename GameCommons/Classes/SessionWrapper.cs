using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using Commons.DTO;
using Commons.Enums;
using Commons.Exceptions;
using Commons.Helpers;
using Commons.Log;
using GameCommons.Helpers;
using WebCommons.Classes.Games;
using WebCommons.Services;

namespace GameCommons.Classes
{
    //TODO: Investigate mysterious data flow loss 
    public class SessionWrapper : IDisposable
    {
        private readonly object streamLock = new object();
        private readonly object updateLock = new object();
        public readonly IDictionary<long, object> localSettings = new Dictionary<long, object>();
        private readonly IDictionary<string, SessionStreamWrapper> streams = new Dictionary<string, SessionStreamWrapper>();
        private readonly IScriptedGameServerRole parentRole;
        private DateTime timeoutDate = DateTime.Now;
        private bool isDisposed;

        public SessionWrapper(IScriptedGameServerRole parentRole, string sessionId, string magic, long casinoId, long referenceId, string nick, bool isServiceSession = false)
        {
            this.parentRole = parentRole;
            IsServiceSession = isServiceSession;
            CasinoId = casinoId;
            ReferenceId = referenceId;
            SessionId = sessionId;
            Magic = magic;
            Nick = nick;
            SessionToken = TokenHelper.CreateGameSessionToken(sessionId, magic);
            Locale = "en";
            Currency = CurrencyTypeEnum.Euro;
            var sessionThread = new Thread(SessionThread) {Name = $"Session {sessionId} background thread", IsBackground = true};
            sessionThread.Start();

        }

        public string SessionId { get; }
        public string Magic { get; private set; }
        public bool IsServiceSession { get; set; }

        public string ExternalSessionId { get; private set; }

        public string ExternalSessionIp { get; private set; }

        public string ClientType { get; set; }

        public bool IsJunk => DateTime.Now - timeoutDate > TimeSpan.FromSeconds(90) && streams.Count == 0;

        public long CasinoId { get; private set; }

        public long UserId { get; private set; }

        public long AccountId { get; private set; }

        public string SessionToken { get; private set; }

        public bool IsLoggedIn => UserId != 0 && AccountId != 0;

        public IDictionary<string, object> Features { get; private set; } = new Dictionary<string, object>();

        public long ReferenceId { get; private set; }

        public bool HasProvablyFair { get; private set; }

        public string Nick { get; private set; }

        public string Locale { get; private set; }

        public CurrencyTypeEnum Currency { get; private set; }

        public GameCallbackData CallbackData { get; private set; }

        public CookieCollection Cookies { get; set; } = new CookieCollection();

        private void SessionThread()
        {
            while (!isDisposed)
            {
                try
                {
                    parentRole.SessionKeepAlive(this);
                }
                catch (Exception ex)
                {
                    Logger.Log(ex);
                }
                finally
                {
                    var counter = 0;
                    while (!isDisposed && counter < 120)
                    {
                        Thread.Sleep(500);
                        counter++;
                    }
                }
            }
        }

        public SessionStreamWrapper GetStreamWrapper(string gameId)
        {
            return GetStreamWrapper(gameId, addNew: false);
        }

        private SessionStreamWrapper GetStreamWrapper(string gameId, bool addNew = true)
        {
            gameId = gameId.ToLower();
            lock (streamLock)
            {
                if (!streams.ContainsKey(gameId))
                {
                    if (!addNew)
                    {
                        return null;
                    }

                    streams[gameId] = new SessionStreamWrapper(this, gameId);
                    streams[gameId].OnDisposed += OnStreamDisposed;
                }

                return streams[gameId];
            }
        }

        private void OnStreamDisposed(object sender, EventArgs e)
        {
            var stream = sender as SessionStreamWrapper;
            if (stream != null)
            {
                stream.OnDisposed -= OnStreamDisposed;
                parentRole.LeaveInternal(this, stream.StreamId);
                lock (streamLock)
                {
                    if (streams.ContainsKey(stream.StreamId))
                    {
                        streams.Remove(stream.StreamId);
                    }
                }
            }
        }

        public void AddOutputMessage(string gameId, string data, SessionMessageTypeEnum type = SessionMessageTypeEnum.Logic)
        {
            GetStreamWrapper(gameId).AddOutputMessage(data, type);
        }

        public void RegisterUserActivity(string gameId)
        {
            var streamWrapper = GetStreamWrapper(gameId, false);
            streamWrapper?.RegisterUserActivity();
        }

        public void SetUserActivityTimeout(string gameId, int timeout)
        {
            if (IsServiceSession)
            {
                return;
            }

            var streamWrapper = GetStreamWrapper(gameId, false);
            streamWrapper?.SetUserActivityTimeout(timeout);
        }

        public int SetUserTimeLimit(string gameId, DateTime startTime, int timeLimit, string timeLimitPopup)
        {
            if (IsServiceSession)
            {
                return 0;
            }

            var streamWrapper = GetStreamWrapper(gameId, false);
            return streamWrapper?.SetUserTimeLimit(startTime, timeLimit, timeLimitPopup) ?? 0;
        }

        public UserInfo GetUserInfo(ScriptedGameContext context, bool createNew = false)
        {
            return GetStreamWrapper(context.Game.Id).GetUserInfo(context, Features, createNew: createNew);
        }

        public void ResetStream(string gameId)
        {
            lock (updateLock)
            {
                var wrapper = GetStreamWrapper(gameId, addNew: true);
                wrapper.ResetUserInfoIfNeeded(CasinoId, UserId, Currency, Locale, Features);
                wrapper.Reset();
            }
        }

        public void UpdateUserData(long userId, long accountId, string nick, CurrencyTypeEnum currency)
        {
            lock (updateLock)
            {
                UserId = userId;
                AccountId = accountId;
                Nick = nick;
                Currency = currency;
            }
        }

        public void UpdateLocale(string locale)
        {
            lock (updateLock)
            {
                if (!String.IsNullOrEmpty(locale) && locale.Length == 2 && locale.IsRegexMatch("[a-zA-Z]{2}"))
                {
                    Locale = locale;
                }
            }
        }

        public void UpdateSessionData(string externalSessionId, string externalSessionIp)
        {
            lock (updateLock)
            {
                if (!String.IsNullOrEmpty(ExternalSessionId) && !ExternalSessionId.EqName(externalSessionId))
                {
                    Logger.Log("Potential external session ID overlapping: {0} and {1} on local sessionId {2}", this.ExternalSessionId, externalSessionId, SessionId);
                }

                ExternalSessionId = externalSessionId;
                ExternalSessionIp = externalSessionIp;
            }
        }

        public void UpdateSessionFeatures(string features)
        {
            lock (updateLock)
            {
                var data = (features ?? string.Empty).Split(',').Select(t => t.Trim().ToLower()).Where(t => !string.IsNullOrEmpty(t)).ToArray();
                var result = new Dictionary<string, object>();
                foreach (var item in data)
                {
                    var itemData = item.Split(new[] {':'}, 2);
                    result[itemData[0]] = itemData.Length > 1 ? (object) itemData[1].Trim() : true;
                }

                HasProvablyFair = result.ContainsKey("provably_fair");
                this.Features = result;

                CallbackData = null;

                if (UserId == 0 || !result.ContainsKey("seamless") || !result.ContainsKey("external_access_point"))
                    return;

                var accessPointId = result["external_access_point"].ToLong();
                CallbackData = ExternalServiceFacade.GetGameCoreService().GetGameCallbackData(accessPointId, UserId);
            }
        }

        public void MarkJunk(string gameId)
        {
            var wrapper = GetStreamWrapper(gameId, false);
            wrapper?.MarkJunk();
        }

        public void SetClientId(string gameId, string clientId)
        {
            GetStreamWrapper(gameId).SetClientId(clientId);
        }

        public void SetInstanceId(string gameId, string instanceId)
        {
            GetStreamWrapper(gameId).SetInstanceId(instanceId);
        }

        public void CleanupMessages(string gameId, TimeSpan safetyBuffer)
        {
            GetStreamWrapper(gameId).CleanupMessages(safetyBuffer);
        }

        public bool IsValidInstanceId(string gameId, string gameInstanceId)
        {
            var stream = GetStreamWrapper(gameId, false);
            if (stream != null)
            {
                return stream.GameInstanceId == gameInstanceId;
            }

            return false;
        }

        public object getLocalSettings(long gameId)
        {
            lock (streamLock)
            {
                if (localSettings.ContainsKey(gameId))
                {
                    return localSettings[gameId];
                }
            }

            return null;
        }

        public void setLocalSettings(long gameId, object settings)
        {
            lock (streamLock)
            {
                localSettings[gameId] = settings;
            }
        }

        protected bool Equals(SessionWrapper other)
        {
            return SessionId == other.SessionId;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            if (ReferenceEquals(this, obj)) return true;
            if (obj.GetType() != this.GetType()) return false;
            return Equals((SessionWrapper) obj);
        }

        public override int GetHashCode()
        {
            return SessionId.GetHashCode();
        }

        public void SetPullingCallback(string gameId, string gameToken, WebSocketWrapper wrapper)
        {
            var streamWrapper = GetStreamWrapper(gameId, false);
            if (streamWrapper == null || streamWrapper.GameInstanceId != gameToken)
            {
                throw new SessionExpiredException();
            }

            streamWrapper.SetPullingCallback(wrapper);
        }

        public void ReleaseStream(string gameInstanceId)
        {
            var stream = GetStreamWrapper(gameInstanceId, false);
            if (stream != null)
            {
                stream.OnDisposed -= OnStreamDisposed;
                stream.Dispose();
            }
        }

        public void Dispose(bool cleanupSessions)
        {
            isDisposed = true;

            lock (streamLock)
            {
                foreach (var stream in streams.Values.ToArray())
                {
                    if (!cleanupSessions)
                    {
                        stream.OnDisposed -= OnStreamDisposed;
                    }

                    stream.Dispose();
                    streams.Remove(stream.StreamId);
                }
            }

            timeoutDate = DateTime.MinValue;
        }

        public void Dispose()
        {
            Dispose(false);
        }
    }
}