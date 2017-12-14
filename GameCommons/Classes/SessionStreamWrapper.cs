using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Commons.DTO;
using Commons.Enums;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;

namespace GameCommons.Classes
{
    public class SessionStreamWrapper : IDisposable
    {
        private const int SESSION_SAVE_PERIOD = 10;
        public event EventHandler<EventArgs> OnDisposed; 
        private readonly object messageLock = new object();
        private readonly object pullingCallbackLock = new object();
        private readonly List<SessionMessage> outputQueue = new List<SessionMessage>();
        private readonly SessionWrapper session;
        private readonly string streamId;
        private DateTime lastUserActionDate;
        private DateTime lastSessionSaveTime;
        private DateTime? lastSessionAliveTime;
        private DateTime? sessionExpirationDate;
        private UserInfo userInfo;
        private WebSocketWrapper pullingCallback;
        private long sendOffset;
        private string gameInstanceId;
        private string clientId;
        private string timeLimitPopup;
        private long messageCounter;
        private int userActivityTimeout;
        private bool isJunk;
        private bool isDisposed;

        public SessionStreamWrapper(SessionWrapper session, string streamId)
        {
            this.session = session;
            this.streamId = streamId;
            RegisterUserActivity();
            var sessionThread = new Thread(SessionProc) { Name = "Session {0}/{1}".FormatString(session.SessionId, streamId), Priority = ThreadPriority.BelowNormal};
            sessionThread.Start();
        }
        
        public string StreamId => streamId;

        public string GameInstanceId => gameInstanceId;

        public UserInfo CurrentUserInfo => userInfo;

        public void RegisterUserActivity()
        {
            lastUserActionDate = EnvironmentHelper.CurrentTime;
        }

        public void SetUserActivityTimeout(int timeout)
        {
            userActivityTimeout = timeout;
        }

        public int SetUserTimeLimit(DateTime startTime, int timeLimit, string timeLimitPopup)
        {
            var cookieId = $"{session.CasinoId}_expirationPeriod";
            if (session.Cookies[cookieId] != null)
            {
                var timeLeft = session.Cookies[cookieId].Value.ToInt(0);
                if (timeLeft < 1)
                {
                    cookieId = $"{session.CasinoId}_expirationDate";
                    if (session.Cookies[cookieId] != null)
                    {
                        this.sessionExpirationDate = session.Cookies[cookieId].Value.ToLong(0).FromJavascriptTime();
                    }
                }
                else
                {
                    this.sessionExpirationDate = EnvironmentHelper.CurrentTime.AddSeconds(timeLeft);
                }
            }

            if (!this.sessionExpirationDate.HasValue || this.sessionExpirationDate.Value < startTime)
            {
                AddCookieMessage($"{session.CasinoId}_expirationDate", startTime.ToJavascriptTime().ToString(), 1);
                this.sessionExpirationDate = startTime.AddSeconds(timeLimit);
            }

            this.timeLimitPopup = timeLimitPopup;
            return (int) this.sessionExpirationDate.Value.Subtract(EnvironmentHelper.CurrentTime).TotalSeconds;
        }

        public void AddOutputMessage(string data, SessionMessageTypeEnum type)
        {
            lock (messageLock)
            {
                outputQueue.Add(new SessionMessage(GetNewMessageId(), data, type));
            }
        }

        public void AddPopupMessage(string popup)
        {
            AddOutputMessage(new Dictionary<string, object> { { "popup", popup } }.SerializeJSON(), SessionMessageTypeEnum.Popup);
        }

        public void AddCookieMessage(string key, string value, int? length)
        {
            AddOutputMessage(new Dictionary<string, object> { { "key", key }, {"value", value}, {"expiration_date", length.HasValue ? (object) length.Value : null} }.SerializeJSON(), SessionMessageTypeEnum.SetCookie);
        }

        public void MarkJunk()
        {
            isJunk = true;
        }

        private void SessionProc()
        {
            sendOffset = 0;
            while (!isDisposed)
            {
                try
                {
                    if (sessionExpirationDate.HasValue)
                    {
                        if (sessionExpirationDate.Value < EnvironmentHelper.CurrentTime)
                        {
                            sessionExpirationDate = null;

                            Task.Run(delegate
                            {
                                AddCookieMessage($"{session.CasinoId}_expirationPeriod", "0", 1);
                                AddPopupMessage(timeLimitPopup);
                                Thread.Sleep(1000);
                                MarkJunk();
                            });
                        }
                        else
                        {

                            lock (pullingCallbackLock)
                            {
                                if (pullingCallback == null || pullingCallback.IsDisposed)
                                {
                                    if (lastSessionAliveTime.HasValue)
                                    {
                                        sessionExpirationDate = sessionExpirationDate.Value.Add(EnvironmentHelper.CurrentTime.Subtract(lastSessionAliveTime.Value));
                                    }
                                }
                                else
                                {
                                    lastSessionAliveTime = EnvironmentHelper.CurrentTime;
                                    if (lastSessionSaveTime < EnvironmentHelper.CurrentTime.AddSeconds(-SESSION_SAVE_PERIOD))
                                    {
                                        lastSessionSaveTime = EnvironmentHelper.CurrentTime;
                                        AddCookieMessage($"{session.CasinoId}_expirationPeriod", Math.Max((int)sessionExpirationDate.Value.Subtract(EnvironmentHelper.CurrentTime).TotalSeconds, 0).ToString(), 1);
                                    }
                                }
                            }
                        } 
                    }

                    lock (pullingCallbackLock)
                    {
                        if (isJunk || (userActivityTimeout > 0 && EnvironmentHelper.CurrentTime.Subtract(lastUserActionDate) > TimeSpan.FromSeconds(userActivityTimeout)))
                        {
                            Dispose();
                            return;
                        }
                    }
                    
                    var messages = PickMessagesInternal(sendOffset);
                    try
                    {
                        foreach (var sessionMessage in messages)
                        {
                            lock (pullingCallbackLock)
                            {
                                if (pullingCallback != null && !pullingCallback.IsDisposed)
                                {
                                    if (pullingCallback.SendData(sessionMessage))
                                    {
                                        sendOffset = sessionMessage.MessageId;
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Logger.Debug(ex);
                        lock (pullingCallbackLock)
                        {
                            if (pullingCallback != null)
                            {
                                pullingCallback.OnDisposed -= OnConnectionDisposed;
                                pullingCallback.Dispose();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Logger.Log(ex);
                    Dispose();
                }
                finally
                {
                    Thread.Sleep(100);
                }
            }
        }

        private SessionMessage[] PickMessagesInternal(long offset)
        {
            var takeAmount = 10;
            lock (messageLock)
            {
                var length = Math.Min(10, outputQueue.Count);
                for (var i = 0; i < length; i++)
                {
                    var messageId = outputQueue[0].MessageId;
                    if (messageId == -1 && offset != -1)
                    {
                        takeAmount = i + 1;
                        break;
                    }

                    if (messageId <= offset)
                    {
                        outputQueue.RemoveAt(0);
                    }
                }

                return outputQueue.Take(takeAmount).ToArray();
            }
        }

        public void CleanupMessages(TimeSpan timeout)
        {
            lock (messageLock)
            {
                foreach (var sessionMessage in outputQueue.Where(q => q.IsExpired(timeout)).ToArray())
                {
                    outputQueue.Remove(sessionMessage);
                }
            }
        }

        public void Reset()
        {
            lock (messageLock)
            {
                outputQueue.Clear();
                messageCounter = 0;
                sendOffset = 0;
                RegisterUserActivity();
            }
        }

        private long GetNewMessageId()
        {
            var result = ++messageCounter;
            if (result > 100000)
            {
                result = -1;
            }
            return result;
        }
        
        public void SetClientId(string clientId)
        {
            this.clientId = clientId;
            userInfo?.SetClientId(clientId);
        }

        public void SetInstanceId(string instanceId)
        {
            gameInstanceId = instanceId;
        }

        public UserInfo GetUserInfo(ScriptedGameContext context, IDictionary<string, object> features, bool createNew = false)
        {
            if (createNew || (userInfo != null && userInfo.context != context))
            {
                userInfo?.Dispose();
                userInfo = null;
            }

            if (userInfo != null)
            {
                userInfo.UserNick = session.Nick;
                return userInfo;
            }

            return userInfo = new UserInfo(context, session.SessionId, session.UserId, session.AccountId, session.CasinoId, session.ExternalSessionId, session.ExternalSessionIp, clientId, session.Locale, session.Currency, session.Nick, session.ClientType, session.Features);
        }

        public void ResetUserInfoIfNeeded(long casinoId, long userId, CurrencyTypeEnum currency, string language, IDictionary<string, object> features)
        {
            if (userInfo != null)
            {
                if (userInfo.UserId != userId || userInfo.CasinoId != casinoId || userInfo.locale.CurrencyValue != currency || features.SerializeJSON() != userInfo.features.SerializeJSON())
                {
                    userInfo = null;
                }
                else if (userInfo.locale.language != language)
                {
                    userInfo.locale = new LocaleInfo(language, userInfo.locale.CurrencyValue);
                }
            }

            if (userInfo != null)
            {
                if (userInfo.isPlayingForFun)
                {
                    userInfo.Reset();
                }
            }
        }

        public void SetPullingCallback(WebSocketWrapper wrapper)
        {
            lock (pullingCallbackLock)
            {
                if (pullingCallback != null)
                {
                    pullingCallback.OnDisposed -= OnConnectionDisposed;
                    pullingCallback.Dispose();
                }

                pullingCallback = wrapper;
                if (pullingCallback != null)
                {
                    pullingCallback.OnDisposed += OnConnectionDisposed;
                }

                sendOffset = 0;
            }
        }

        private void OnConnectionDisposed(WebSocketWrapper socket)
        {
            lock (pullingCallbackLock)
            {
                socket.OnDisposed -= OnConnectionDisposed;
                if (socket == pullingCallback)
                {
                    pullingCallback = null;
                }

                if (session.IsServiceSession)
                {
                    MarkJunk();
                }
            }
        }

        public void Dispose()
        {
            if (isDisposed)
            {
                return;
            }

            isDisposed = true;

            OnDisposed?.Invoke(this, new EventArgs());

            if (userActivityTimeout > 0 && EnvironmentHelper.CurrentTime.Subtract(lastUserActionDate) > TimeSpan.FromSeconds(userActivityTimeout))
            {
                Logger.Log("Disposing session stream {0}/{1} due to user timeout", session.SessionId, streamId);
            }
            else
            {
                Logger.Log("Disposing session stream {0}/{1} due to unexpected reason", session.SessionId, streamId);
            }

            lock (pullingCallbackLock)
            {
                if (pullingCallback != null)
                {
                    pullingCallback.OnDisposed -= OnConnectionDisposed;
                    pullingCallback.Dispose();
                    pullingCallback = null;
                }
            }

            userInfo?.Dispose();
            userInfo = null;
        }
    }
}