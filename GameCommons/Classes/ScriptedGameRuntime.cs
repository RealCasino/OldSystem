using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Commons.DTO;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;
using GameCommons.Classes.WCF;

namespace GameCommons.Classes
{
    public class ScriptedGameRuntime : IDisposable
    {
        private readonly ScriptedGameContext context;
        private readonly ILiveReportTracker reportTracker;
        private int maxSessionsValue = 300;
        private int gameTimeoutInSecondsValue = 600;
        private int userTimeoutInSecondsValue = 600;
        private bool hasKeepAlive;
        private DateTime? keepAliveDate;
        private int roundLength;
        private int currentDisableReason = -1;
        private bool isDisabled;
        private bool isTimeoutDisabled;
        
        public ScriptedGameRuntime(ScriptedGameContext context, ILiveReportTracker reportTracker, double externalDelay)
        {
            this.context = context;
            this.reportTracker = reportTracker;
            this.externalDelay = externalDelay;
            userTimeoutInSecondsValue = context.Game.GetInstanceSetting("userTimeoutInSeconds", 600);
            gameTimeoutInSecondsValue = context.Game.GetInstanceSetting("gameTimeoutInSeconds", 600);
        }

        public int gameTimeoutInSeconds
        {
            get { return gameTimeoutInSecondsValue; }
            set { gameTimeoutInSecondsValue = value; }
        }

        public int userTimeoutInSeconds
        {
            get { return userTimeoutInSecondsValue; }
            set
            {
                userTimeoutInSecondsValue = value;
                context.SetSessionActivityTimeout(null, value);
            }
        }

        public int maxSessions
        {
            get { return maxSessionsValue; }
            set { maxSessionsValue = Math.Min(Math.Max(value, 0), 50000); }
        }

        public ScriptedGameContext Context => context;
        
        public double externalDelay { get; set; }

        public bool isProvablyFair { get; set; }

        public bool isMultiplayer { get; set; }

        public bool IsDisabled => isDisabled;

        public bool HasKeepAlive => hasKeepAlive;
        
        public object onServerMessage { get; set; }

        public void SendServerMessage(ServerMessageTypeEnum type, IDictionary<string, object> data)
        {
            if (onServerMessage != null)
            {
                var message = new Dictionary<string, object>
                {
                    {"type", type}
                };

                if (data != null)
                {
                    foreach (var item in data)
                    {
                        message[item.Key] = item.Value;
                    }
                }

                context.Game.Log(message.SerializeJSON());
                context.Game.ExecuteCallback(this, onServerMessage, true, message);
            }
        }

        public void setGameMode(object value)
        {
            var flags = value as IDictionary<string, object>;
            if (flags == null)
            {
                context.Game.LogError(new Exception("setGameMode called with not an object as parameter."));
                return;
            }

            foreach (var item in flags)
            {
                switch (item.Key.ToLower())
                {
                    case "keep-alive":
                    case "keepalive":
                        hasKeepAlive = item.Value.ToString().ToBool();
                        break;
                }
            }
        }
        
        public void setGameState(string sessionId, string state, string description)
        {
            var roundState = state.ToEnum(GameStateEnum.Unknown);
            DateTime? endDate = null;
            switch (roundState)
            {
                case GameStateEnum.Opened:
                    
                    Task.Run(delegate
                    {
                        try
                        {
                            context.accountingHelper.SendWins(sessionId);
                        }
                        catch (Exception ex)
                        {
                            context.Game.LogError(ex);
                        }
                    });

                    foreach (var session in context.sessions)
                    {
                        context.GetSession(session)?.GetUserInfo(context)?.CheckUserState();
                    }
                    
                    if (roundLength >= 0)
                    {
                        endDate = EnvironmentHelper.CurrentTime.AddSeconds(roundLength);
                    }

                    context.accountingHelper.RegisterNewRound(sessionId, description);
                    break;
                case GameStateEnum.Closed:
                    break;
            }

            context.Game.UpdateGameState(roundState, description, endDate);
        }

        public void setRoundLength(string length)
        {
            roundLength = length.ToInt(0);
        }

        public void disableInstance(string message, int reason)
        {
            if (!isDisabled || currentDisableReason != reason)
            {
                context.Game.Log("Disabling the instance with message: {0}", message);
                isDisabled = true;
                currentDisableReason = reason;
                var parameters = new Dictionary<string, object> { { "reason", reason } };

                if (reason == 2)
                {
                    try
                    {
                        var info = BaseExternalGameInfoService.Gateway.GetOfflineGameInfo(context.Game.Id, 0, 0, 0);
                        var offlineImage = info.Evaluate<string>(BaseExternalGameInfoService.OFFLINE_IMAGE);
                        if (!String.IsNullOrEmpty(offlineImage))
                        {
                            parameters[BaseExternalGameInfoService.OFFLINE_IMAGE] =  offlineImage.FixUrl(true);
                        }
                    }
                    catch (Exception exx)
                    {
                        Logger.Log(exx);
                    }
                }

                context.accountingHelper.CancelCurrentBets(null, "instance is disabled");
                SendServerMessage(ServerMessageTypeEnum.disable_instance, parameters);
                context.sendSystemAllInternal(SessionMessageTypeEnum.Disable, parameters);
                context.Game.UpdateGameState(GameStateEnum.Disabled, "Instance is disabled", null);
            }
        }

        public void enableInstance()
        {
            if (isDisabled)
            {
                context.Game.Log("Enabling the instance");
                keepAlive();
                isTimeoutDisabled = false;
                isDisabled = false;
                currentDisableReason = -1;
                SendServerMessage(ServerMessageTypeEnum.enable_instance, null);
                context.sendSystemAllInternal(SessionMessageTypeEnum.Enable, null);
                context.Game.UpdateGameState(GameStateEnum.Enabled, "Instance is enabled", null);
            }
        }

        public void keepAlive()
        {
            if (hasKeepAlive)
            {
                keepAliveDate = EnvironmentHelper.CurrentTime.AddSeconds(gameTimeoutInSecondsValue);
            }
        }

        public void RegisterNewSession(SessionWrapper sessionWrapper)
        {
            var userInfo = sessionWrapper.GetUserInfo(context);
            if (isProvablyFair)
            {
                userInfo.rng.CheckOldSession();
            }

            if (sessionWrapper.UserId > 0)
            {
                reportTracker.Register(context.Game.IdLong, sessionWrapper.CasinoId, sessionWrapper.UserId);
            }

            sessionWrapper.SetUserActivityTimeout(context.Game.Id, userTimeoutInSeconds);

            if (userInfo.features.ContainsKey("time_limit"))
            {
                var startTime = userInfo.features.Evaluate<long>("time_limit_date").FromJavascriptTime();
                var timeLimit = userInfo.features.Evaluate<int>("time_limit");
                timeLimit = sessionWrapper.SetUserTimeLimit(context.Game.Id, startTime, timeLimit, userInfo.features.Evaluate("time_limit_popup", "time_limit_popup"));
                context.sendSystemInternal(sessionWrapper.SessionId, SessionMessageTypeEnum.TimeLimit, new Dictionary<string, object> { {"timeLimit", Math.Max(0, timeLimit) } });;
            }
        }

        public void UpdateRuntime()
        {
            if (isDisabled && !isTimeoutDisabled)
            {
                return;
            }

            if (keepAliveDate.HasValue)
            {
                if (!isDisabled && EnvironmentHelper.CurrentTime > keepAliveDate.Value && !isTimeoutDisabled)
                { 
                    isTimeoutDisabled = true;
                    disableInstance("keep-alive timeout", 0);
                }
                else if (EnvironmentHelper.CurrentTime < keepAliveDate.Value && isTimeoutDisabled)
                {
                    isTimeoutDisabled = false;
                    enableInstance();
                }
            }
        }

        public void NotifyShutdown(int timeout)
        {
            context.sendSystemAllInternal(SessionMessageTypeEnum.Shutdown, new Dictionary<string, object> { { "date", EnvironmentHelper.CurrentTime.AddSeconds(timeout).ToJavascriptTime() } });
        }

        public void NotifyRestart(int timeout)
        {
            context.sendSystemAllInternal(SessionMessageTypeEnum.Restart, new Dictionary<string, object> { { "date", EnvironmentHelper.CurrentTime.AddSeconds(timeout).ToJavascriptTime() } });
        }
       
        public void Dispose()
        {
        }
    }
}