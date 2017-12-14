using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Commons.DTO;
using Commons.Enums;
using Commons.Helpers;
using Commons.Network.JSON;
using GameCommons.Enums;

namespace GameCommons.Classes
{
    public class AccountingHelper : IDisposable
    {
        private readonly ScriptedGameContext context;
        private readonly IDictionary<long, long> roundCounters = new Dictionary<long, long>();
        private readonly IDictionary<string, UserInfo> betUsers = new Dictionary<string, UserInfo>();
        private readonly ConcurrentDictionary<string, UserBetStore> userBetStores = new ConcurrentDictionary<string, UserBetStore>();
        private readonly ConcurrentDictionary<string, UserWinData> userWinStore = new ConcurrentDictionary<string, UserWinData>();
        private readonly IDictionary<string, UserInfo> tempUsers = new Dictionary<string, UserInfo>();
        private readonly ILiveReportTracker reportTracker;
        private readonly IAccountingFacade accountingFacade;
        private readonly bool trackFunData;

        public AccountingHelper(ScriptedGameContext context, IAccountingFacade accountingFacade, ILiveReportTracker reportTracker, bool trackFunData)
        {
            this.context = context;
            this.trackFunData = trackFunData;
            this.reportTracker = reportTracker;
            this.accountingFacade = accountingFacade;
            reportTracker.Clear(context.Game.IdLong, 0);
        }

        public long requestBalance(string sessionId)
        {
            context.RegisterSessionActivity(sessionId);

            var userInfo = context.getUserInfo(sessionId);
            if (userInfo == null)
            {
                return -2;
            }

            context.Game.Log($"Requesting balance (sessionID: {sessionId}, account: {userInfo.AccountId}, seamless: {userInfo.Seamless}, userId: {userInfo.UserId}, accessPointId: {userInfo.AccessPointId})");

            Task.Factory.StartNew(s =>
            {
                var info = (UserInfo)s;

                context.Game.Log($"Refreshing balance (sessionID: {info.sessionId}, account: {info.AccountId}, userId: {info.UserId}, seamless: {info.Seamless}, balance: {info.Balance})");

                info.RefreshBalance();

                return s;
            }, userInfo)
            .ContinueWith(t =>
            {
                var info = (UserInfo)t.Result;

                context.Game.Log($"Balance refreshed (sessionID: {info.sessionId}, account: {info.AccountId}, userId: {info.UserId}, seamless: {info.Seamless}, balance: {info.Balance})");

                SendBalanceChanged(info.sessionId, info.Balance, info.totalLoss);
            });

            return 0;
        }

        public UserInfo GetUserInfo(string sessionId)
        {
            return sessionId == null ? null : betUsers.ContainsKey(sessionId) ? betUsers[sessionId] : null;
        }

        public void registerRoundOpen(string roundId)
        {
            context.Game.Log($"Registering round open: {roundId}");
            accountingFacade.RegisterRoundOpen(context.Game.IdLong, roundId.ToLong(0));
        }

        public void registerRoundResult(string roundId, object data)
        {
            context.Game.Log($"Registering round result for {roundId}: {data.SerializeJSON()}");
            accountingFacade.RegisterRoundResult(context.Game.IdLong, roundId.ToLong(0), data);
        }

        public void overrideRoundResult(string roundId, object data)
        {
            context.Game.Log($"Overriding round result for {roundId}: {data.SerializeJSON()}");
            accountingFacade.OverrideRoundResult(context.Game.IdLong, roundId.ToLong(0), data);
        }

        public long registerBet(string sessionId, string roundId, string amount, object betData, string comment)
        {
            context.RegisterSessionActivity(sessionId);
            if (context.Game.Runtime.IsDisabled)
            {
                return -1;
            }

            var userInfo = context.getUserInfo(sessionId);
            if (userInfo == null)
            {
                return -1;
            }

            var moneyAmount = amount.ToDecimal();
            if (moneyAmount < 0.01m)
            {
                context.Game.Log($"User (fun: {userInfo.isPlayingForFun}, account: {userInfo.AccountId}, casino-id: {userInfo.CasinoId}) made bet (type: '{betData.SerializeJSON()}', amount: '{amount}', round: '{roundId}', reason: '{comment}') couldn't make bet: invalid amount: {moneyAmount}");
                return -1;
            }

            if (userInfo.Balance < moneyAmount)
            {
                context.Game.Log($"User (fun: {userInfo.isPlayingForFun}, account: {userInfo.AccountId}, casino-id: {userInfo.CasinoId}) made bet (type: '{betData.SerializeJSON()}', amount: '{amount}', round: '{roundId}', reason: '{comment}') couldn't make bet: not enough money");
                return -1;
            }

            var roundIdLong = roundId.ToLong(0);

            try
            {
                userInfo.Balance -= moneyAmount;
                userInfo.totalBetAmount += moneyAmount;

                userInfo.roundWinAmount = 0;

                context.Game.Log($"User (fun: {userInfo.isPlayingForFun}, account: {userInfo.AccountId}, casino-id: {userInfo.CasinoId}) made bet (type: '{betData.SerializeJSON()}', amount: '{amount}', round: '{roundIdLong}', reason: '{comment}').");

                if (!userInfo.isPlayingForFun)
                {
                    if (!userWinStore.ContainsKey(sessionId))
                    {
                        userWinStore[sessionId] = new UserWinData(roundIdLong, userInfo.Seamless, userInfo.CasinoId, userInfo.UserId, userInfo.AccountId, userInfo.AccessPointId, userInfo.ExternalSessionId, userInfo.ExternalSessionIp, userInfo.locale.CurrencyValue, userInfo.ClientType, userInfo.isPlayingForFun);
                    }
                }

                betUsers[sessionId] = userInfo;

                UserBetStore userBetStore;
                if (!userBetStores.TryGetValue(sessionId, out userBetStore))
                {
                    userBetStore = new UserBetStore();
                    userBetStores[sessionId] = userBetStore;
                }

                var betResult = userBetStore.MakeBet(roundIdLong, roundCounters, betData, userInfo.locale.CurrencyValue, moneyAmount, comment);

                SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

                context.Game.SetPlayerBets(sessionId, userBetStore.GetBets(roundIdLong).Sum(b => b.Amount));

                context.Game.Log("Bet has been successfully registered.", context.Game.Name);
                
                if (!userInfo.isPlayingForFun)
                {
                    reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                    {
                        {"userId", userInfo.UserId },
                        {"username", userInfo.Username },
                        {"gameId", context.Game.IdLong },
                        {"gameTitle", context.Game.Id },
                        {"type", LiveActivityTypeEnum.Bet },
                        {"currency", (long) userInfo.locale.CurrencyValue },
                        {"amount", amount },
                        {"date", EnvironmentHelper.CurrentTime },
                        {"data", betData },
                        {"resultBalance", userInfo.Balance },
                    });
                }

                return betResult.BetId;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return -1;
            }
        }

        //TODO Check roundBetId exists
        public long registerWin(string sessionId, string roundId, string roundBetId, string amount, object winBetData, string comment, object successCallback, object failureCallback)
        {
            context.RegisterSessionActivity(sessionId);

            var userInfo = context.getUserInfo(sessionId) ?? (betUsers.ContainsKey(sessionId) ? betUsers[sessionId] : tempUsers.ContainsKey(sessionId) ? tempUsers[sessionId] : null);

            if (userInfo == null)
            {
                if (!betUsers.TryGetValue(sessionId, out userInfo))
                {
                    tempUsers.TryGetValue(sessionId, out userInfo);
                }
            }

            if (userInfo == null)
            {
                return -2;
            }

            var moneyAmount = amount.ToDecimal();
            if (moneyAmount < 0.01m)
            {
                context.Game.Log($"Invalid amount: {moneyAmount}");
                return -3;
            }

            var roundIdLong = roundId.ToLong(0);
            var roundBetIdLong = roundBetId.ToLong(0);

            context.Game.Log($"User (fun: {userInfo.isPlayingForFun}, account: {userInfo.AccountId}, casino-id: {userInfo.CasinoId}) won (amount: '{amount}', round: '{roundIdLong}', roundBetId '{roundBetId}', betData '{winBetData.SerializeJSON()}' reason: '{comment}').");
            context.storageHelper.RegisterWin(userInfo, moneyAmount, winBetData);

            var winDataInfo = new Dictionary<string, object>
            {
                {"gameId", context.Game.Id},
                {"roundId", roundIdLong},
                {"roundBetId", roundBetIdLong},
                {"winData", winBetData},
                {"comment", comment}
            };

            userInfo.totalWinAmount += moneyAmount;
            userInfo.roundWinAmount += moneyAmount;
            context.Game.SetPlayerWin(sessionId, userInfo.roundWinAmount);

            if (!userWinStore.ContainsKey(sessionId))
            {
                userWinStore[sessionId] = new UserWinData(roundIdLong, userInfo.Seamless, userInfo.CasinoId, userInfo.UserId, userInfo.AccountId, userInfo.AccessPointId, userInfo.ExternalSessionId, userInfo.ExternalSessionIp, userInfo.locale.CurrencyValue, userInfo.ClientType, userInfo.isPlayingForFun);
            }

            userWinStore[sessionId].SuccessCallback = successCallback;
            userWinStore[sessionId].FailureCallback = failureCallback;
            userWinStore[sessionId].WinData.Add(new UserWinItemData(roundBetIdLong, moneyAmount, winBetData, winDataInfo));

            userInfo.Balance += moneyAmount;
            SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

            if (!userInfo.isPlayingForFun)
            {
                reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                {
                    {"userId", userInfo.UserId },
                    {"username", userInfo.Username },
                    {"gameId", context.Game.IdLong },
                    {"gameTitle", context.Game.Id },
                    {"type", LiveActivityTypeEnum.Win },
                    {"currency", (long) userInfo.locale.CurrencyValue},
                    {"amount", amount },
                    {"date", EnvironmentHelper.CurrentTime },
                    {"data", winBetData },
                    {"resultBalance", userInfo.balance },
                });
            }

            Task.Run(delegate
            {
                try
                {
                    context.Game.RunInSync(() => SendWins(sessionId), ignoreGameStatus: true);
                }
                catch (Exception ex)
                {
                    if (userInfo != null)
                    {
                        userInfo.totalWinAmount -= moneyAmount;
                    }

                    context.Game.LogError(ex);

                    try
                    {
                        context.Game.ExecuteCallback(this, failureCallback, false, sessionId);
                    }
                    catch (Exception exx)
                    {
                        context.Game.LogError(exx);
                    }
                }
            });

            return 0;
        }

        internal void SendWins(string sessionId)
        {
            if (String.IsNullOrEmpty(sessionId) || sessionId.EqName("0"))
            {
                foreach (var data in userWinStore)
                {
                    SendWin(sessionId, data.Value);
                }

                userWinStore.Clear();
            }
            else
            {
                if (userWinStore.ContainsKey(sessionId))
                {
                    UserWinData result;
                    var found = userWinStore.TryRemove(sessionId, out result);
                    if (found)
                    {
                        SendWin(sessionId, result);
                    }
                }
            }
        }

        private void SendWin(string sessionId, UserWinData winData)
        {
            UserInfo userInfo = null;
            decimal moneyAmount = 0;
            try
            {
                userInfo = context.GetSession(sessionId)?.GetUserInfo(context);
                moneyAmount = winData.WinData.Sum(a => a.Amount);

                if (!winData.IsPlayingForFun)
                {
                    var result = accountingFacade.RegisterPlayerWins(context.Game.IdLong, winData.CasinoId, winData.UserId, winData.AccountId, winData.RoundId, winData, winData.AccessPointId, winData.ExternalSessionId, winData.ExternalSessionIp, winData.SeamlessMode, winData.ClientType);
                    if (userInfo != null)
                    {
                        userInfo.SetBalance(result);
                        SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);
                    }

                    if (moneyAmount > 0)
                    {
                        accountingFacade.UpdateGameIncome(winData.CasinoId, context.Game.IdLong, EnvironmentHelper.CurrentTime, winData.Currency, 0.0m, moneyAmount, true);
                    }
                }
                else
                {
                    if (trackFunData && moneyAmount > 0)
                    {
                        accountingFacade.UpdateGameIncome(winData.CasinoId, context.Game.IdLong, EnvironmentHelper.CurrentTime, winData.Currency, 0.0m, moneyAmount, false);
                    }
                }

                if (moneyAmount > 0)
                {
                    foreach (var userWinItemData in winData.WinData)
                    {
                        context.Game.ExecuteCallback(this, winData.SuccessCallback, false, sessionId, userWinItemData.WinDataObject, userWinItemData.Amount);
                    }
                }
            }
            catch (Exception ex)
            {
                if (userInfo != null)
                {
                    userInfo.totalWinAmount -= moneyAmount;
                }

                context.Game.LogError(ex);

                try
                {
                    if (moneyAmount > 0)
                    {
                        context.Game.ExecuteCallback(this, winData.FailureCallback, false, sessionId);
                    }
                }
                catch (Exception exx)
                {
                    context.Game.LogError(exx);
                }
            }
        }

        public long cancelBet(string sessionId, string roundId, string amount, object betData)
        {
            context.RegisterSessionActivity(sessionId);
            try
            {
                var userInfo = betUsers.ContainsKey(sessionId) ? betUsers[sessionId] : null;
                if (userInfo == null)
                {
                    return -2;
                }

                var moneyAmount = amount.ToDecimal();
                if (moneyAmount < 0.01m)
                {
                    context.Game.Log($"Invalid amount: {moneyAmount}");
                    return -3;
                }

                var roundIdLong = roundId.ToLong(0);

                context.Game.Log("Cancelling bet amount '{0}' at round '{1}' for account {2} for bet {3}.", amount, roundIdLong, userInfo.AccountId, betData.SerializeJSON());

                UserBetStore userBetStore;
                if (userBetStores.TryGetValue(sessionId, out userBetStore))
                {
                    var cancelledAmount = userBetStore.CancelBet(roundIdLong, betData, moneyAmount);
                    if (cancelledAmount <= 0)
                    {
                        throw new Exception($"Can't cancel amount {moneyAmount}, bet amount <= 0");
                    }

                    if (cancelledAmount < moneyAmount)
                    {
                        throw new Exception($"Can't cancel amount {moneyAmount}, bet amount <= {moneyAmount} (only able to cancel {cancelledAmount})");
                    }

                    userInfo.Balance += moneyAmount;
                    userInfo.totalBetAmount -= moneyAmount;
                    context.Game.SetPlayerBets(sessionId, userBetStore.GetBets(roundIdLong).Sum(b => b.Amount));
                }
                
                SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

                if (!userInfo.isPlayingForFun)
                {
                    reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                    {
                        {"userId", userInfo.UserId },
                        {"username", userInfo.Username },
                        {"gameId", context.Game.IdLong },
                        {"gameTitle", context.Game.Id },
                        {"type", LiveActivityTypeEnum.CancelBet },
                        {"currency", (long) userInfo.locale.CurrencyValue },
                        {"amount", amount },
                        {"date", EnvironmentHelper.CurrentTime },
                        {"data", betData },
                        {"resultBalance", userInfo.Balance },
                    });
                }

                return 0;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return -1;
            }
        }

        public long cancelBetsByUser(string sessionId, string roundId, string comment)
        {
            context.RegisterSessionActivity(sessionId);

            try
            {
                var userInfo = betUsers.ContainsKey(sessionId) ? betUsers[sessionId] : null;
                if (userInfo == null)
                {
                    return -2;
                }

                try
                {
                    var roundIdLong = roundId.ToLong(0);

                    UserBetStore userBetStore;
                    if (userBetStores.TryGetValue(sessionId, out userBetStore))
                    {
                        var betAmount = userBetStore.CancelBets(roundIdLong);

                        context.Game.Log("Cancelling all bets with amount '{0}' at round '{1}' for account {2} with comment {3}", betAmount, roundIdLong, userInfo.AccountId, comment);

                        userInfo.Balance += betAmount;
                        userInfo.totalBetAmount -= betAmount;
                        context.Game.SetPlayerBets(sessionId, userBetStore.GetBets(roundIdLong).Sum(b => b.Amount));

                        SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

                        if (!userInfo.isPlayingForFun)
                        {
                            reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                            {
                                {"userId", userInfo.UserId },
                                {"username", userInfo.Username },
                                {"gameId", context.Game.IdLong },
                                {"gameTitle", context.Game.Id },
                                {"type", LiveActivityTypeEnum.CancelBets },
                                {"currency", (long) userInfo.locale.CurrencyValue },
                                {"amount", betAmount },
                                {"date", EnvironmentHelper.CurrentTime },
                                {"resultBalance", userInfo.Balance },
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    context.Game.LogError(ex);
                    return -1;
                }

                return 0;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return -1;
            }
        }

        public long cancelBets(string roundId, string comment)
        {
            try
            {
                var roundIdLong = roundId.ToLong(0);
                context.Game.Log("Cancelling all bets for round '{0}' with reason '{1}'", roundIdLong, comment);

                foreach (var kvp in betUsers)
                {
                    var sessionId = kvp.Key;
                    var userInfo = kvp.Value;

                    UserBetStore userBetStore;
                    if (userBetStores.TryGetValue(sessionId, out userBetStore))
                    {
                        var betAmount = userBetStore.CancelBets(roundIdLong);
                        userInfo.Balance += betAmount;
                        userInfo.totalBetAmount -= betAmount;
                        context.Game.SetPlayerBets(sessionId, userBetStore.GetBets(roundIdLong).Sum(b => b.Amount));

                        SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

                        if (!userInfo.isPlayingForFun)
                        {
                            reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                            {
                                {"userId", userInfo.UserId },
                                {"username", userInfo.Username },
                                {"gameId", context.Game.IdLong },
                                {"gameTitle", context.Game.Id },
                                {"type", LiveActivityTypeEnum.CancelBets },
                                {"currency",  (long) (userInfo.locale?.CurrencyValue ?? 0) },
                                {"amount", betAmount },
                                {"date", EnvironmentHelper.CurrentTime },
                                {"resultBalance", userInfo.Balance },
                            });
                        }
                    }

                    context.Game.SetPlayerBets(sessionId, 0);
                }

                betUsers.Clear();
                userBetStores.Clear();
                tempUsers.Clear();
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return -1;
            }

            return 0;
        }

        public long CancelCurrentBets(string sessionId, string comment)
        {
            try
            {
                if (String.IsNullOrEmpty(sessionId))
                {
                    if (betUsers.Count > 0)
                    {
                        context.Game.Log($"Cancelling all current bets with reason '{comment}'");
                    }

                    foreach (var kvp in betUsers)
                    {
                        CancelCurrentBetsForSession(kvp.Key);
                    }

                    betUsers.Clear();
                    userBetStores.Clear();
                    tempUsers.Clear();
                }
                else
                {
                    if (!betUsers.ContainsKey(sessionId))
                    {
                        return 0;
                    }

                    context.Game.Log($"Cancelling all current bets of {sessionId} with reason '{comment}'");

                    UserBetStore betStore;
                    betUsers.Remove(sessionId);
                    userBetStores.TryRemove(sessionId, out betStore);
                    if (tempUsers.ContainsKey(sessionId))
                    {
                        tempUsers.Remove(sessionId);
                    }
                }
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return -1;
            }

            return 0;
        }

        private void CancelCurrentBetsForSession(string sessionId)
        {
            if (!betUsers.ContainsKey(sessionId))
            {
                return;
            }

            var userInfo = betUsers[sessionId];
            UserBetStore userBetStore;
            if (userBetStores.TryGetValue(sessionId, out userBetStore))
            {
                var betAmount = userBetStore.CancelBets(userBetStore.CurrentRoundId);
                userInfo.Balance += betAmount;
                userInfo.totalBetAmount -= betAmount;
                context.Game.SetPlayerBets(sessionId, userBetStore.GetBets(userBetStore.CurrentRoundId).Sum(b => b.Amount));

                SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);

                if (!userInfo.isPlayingForFun)
                {
                    reportTracker.Add(userInfo.CasinoId, context.Game.IdLong, userInfo.UserId, new Dictionary<string, object>
                    {
                        {"userId", userInfo.UserId},
                        {"username", userInfo.Username},
                        {"gameId", context.Game.IdLong},
                        {"gameTitle", context.Game.Id},
                        {"type", LiveActivityTypeEnum.CancelBets},
                        {"currency",  (long) (userInfo.locale?.CurrencyValue ?? 0)},
                        {"amount", betAmount},
                        {"date", EnvironmentHelper.CurrentTime},
                        {"resultBalance", userInfo.Balance},
                    });
                }
            }

            context.Game.SetPlayerBets(sessionId, 0);
        }

        public long completeBets(string sessionId, string roundId, object successCallback, object failureCallback)
        {
            context.Game.Log($"Completing bets (sessionId: {sessionId}, round: {roundId})");

            context.RegisterSessionActivity(sessionId);
            accountingFacade.RegisterRoundClosed(context.Game.IdLong, roundId.ToLong(0));

            var userInfo = context.getUserInfo(sessionId);
            if (userInfo == null)
            {
                return -2;
            }

            var roundIdLong = roundId.ToLong(0);

            Task.Run(() =>
            {
                try
                {
                    UserBetStore userBetStore;
                    if (!userBetStores.TryGetValue(sessionId, out userBetStore) || userBetStore.IsEmpty(roundIdLong))
                    {
                        context.Game.ExecuteCallback(this, successCallback, false);
                        return;
                    }

                    var userBets = userBetStore.GetBets(roundIdLong);

                    if (!userInfo.isPlayingForFun)
                    {
                        var seamless = userInfo.Seamless;
                        var accessPointId = userInfo.AccessPointId;

                        context.Game.Log($"Making bets '{userBets.Select(b => $"\n (round: '{roundIdLong}', sessionId '{sessionId}', betInfo: '{b.BetData.SerializeJSON()}', amount: {b.Amount}").JoinString("; ")}).");

                        userInfo.SetBalance(accountingFacade.MakeBets(context.Game.IdLong, userInfo.CasinoId, userInfo.UserId, userInfo.AccountId, roundIdLong, userBets.Select(b => new BetData((long) b.Currency, b.Amount, roundIdLong, b.BetId, b.BetData.SerializeJSON())).ToArray(), userInfo.ExternalSessionId, userInfo.ExternalSessionIp, accessPointId, seamless, userInfo.ClientType));
                        context.Game.Log("Bets are made", context.Game.Name);

                        accountingFacade.UpdateGameIncome(userInfo.CasinoId, context.Game.IdLong, EnvironmentHelper.CurrentTime, userInfo.locale.CurrencyValue, userBets.Sum(b => b.Amount), 0.0m, true);
                    }
                    else if (trackFunData)
                    {
                        var sum = userBets.Sum(b => b.Amount);
                        accountingFacade.UpdateGameIncome(userInfo.CasinoId, context.Game.IdLong, EnvironmentHelper.CurrentTime, userInfo.locale.CurrencyValue, sum, 0.0m, false);
                    }

                    userBetStore.CancelBets(roundIdLong);

                    SendBalanceChanged(sessionId, userInfo.Balance, userInfo.totalLoss);
                    context.Game.ExecuteCallback(this, successCallback, false, new object[] { userBets.Select(b => b.BetData).ToArray() });
                }
                catch (Exception ex)
                {
                    context.Game.LogError(ex);

                    UserWinData winStore;
                    userWinStore.TryRemove(sessionId, out winStore);

                    requestBalance(sessionId);

                    try
                    {
                        context.Game.ExecuteCallback(this, failureCallback, false, sessionId);
                    }
                    catch (Exception exx)
                    {
                        context.Game.LogError(exx);
                    }
                }
            });

            return 0;
        }

        public object getRoundBets(string roundId)
        {
            try
            {
                tempUsers.Clear();

                var bets = accountingFacade.GetRoundBets(context.Game.IdLong, roundId.ToLong(0));
                foreach (var bet in bets)
                {
                    var userId = (long)bet["userId"];
                    var casinoId = (long)bet["casinoId"];
                    var userInfo = (IDictionary<string, object>)bet["userData"];
                    var externalSessionId = (string)userInfo["sessionId"];

                    var realSessionId = context.getSessionId(userId, casinoId);

                    if (!string.IsNullOrEmpty(realSessionId) && context.GetSession(realSessionId).ExternalSessionId != externalSessionId)
                    {
                        realSessionId = null;
                    }

                    var sessionId = string.Concat("_", Guid.NewGuid().ToString());

                    var externalSessionIp = userInfo["sessionIp"] as string;
                    var accountId = (long)bet["accountId"];
                    
                    var features = new Dictionary<string, object>();

                    if (userInfo.Evaluate<long>("accessPointId") > 0)
                    {
                        features.Add("external_access_point", userInfo["accessPointId"]);
                    }

                    if (userInfo.Evaluate<bool>("seamless"))
                    {
                        features.Add("seamless", true);
                    }

                    bet["sessionId"] = realSessionId ?? sessionId;
                    tempUsers.Add(sessionId, new UserInfo(context, sessionId, userId, accountId, casinoId, externalSessionId, externalSessionIp, null, null, CurrencyTypeEnum.Euro, null, "other", features));
                }

                return bets;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
            }

            return null;
        }

        public void cancelRound(string roundId, string cancelBets, object successCallback, object failureCallback)
        {
            Task.Run(() =>
            {
                try
                {
                    var roundIdLong = roundId.ToLong();
                    var cancelBetsBool = cancelBets.ToBool();

                    if (roundIdLong == context.roundCounter.current)
                    {
                        userBetStores.Clear();
                        betUsers.Clear();
                        tempUsers.Clear();
                    }

                    accountingFacade.CancelRound(context.Game.IdLong, roundIdLong, cancelBetsBool);

                    if (roundIdLong == context.roundCounter.current)
                    {
                        foreach (var userInfo in context.sessions.Select(context.getUserInfo))
                        {
                            userInfo.RefreshBalance();
                            SendBalanceChanged(userInfo.sessionId, userInfo.Balance, userInfo.totalLoss);
                        }
                    }

                    context.sendSystemAllInternal(SessionMessageTypeEnum.RoundCancel, new Dictionary<string, object> { { "roundId", roundId } });

                    context.Game.ExecuteCallback(this, successCallback, false);
                }
                catch (Exception ex)
                {
                    context.Game.LogError(ex);
                    try
                    {
                        context.Game.ExecuteCallback(this, failureCallback, false);
                    }
                    catch (Exception exx)
                    {
                        context.Game.LogError(exx);
                    }
                }
            });
        }

        public void finishRound(string roundId)
        {
            var roundIdLong = roundId.ToLong(0);
            context.Game.Log($"Finishing round {roundId}");
            foreach (var userBetStore in userBetStores)
            {
                userBetStore.Value.CancelBets(roundIdLong);
            }

            if (roundCounters.ContainsKey(roundIdLong))
            {
                roundCounters.Remove(roundIdLong);
            }
        }

        internal void SendBalanceChanged(string sessionId, decimal balance, decimal totalLoss)
        {
            try
            {
                TaskHelper.RunDelayedTask($"gmac_{sessionId}", 500, delegate {
                    context.Game.Runtime.SendServerMessage(ServerMessageTypeEnum.refresh_user_data, new Dictionary<string, object>
                    {
                        ["sessionId"] = sessionId,
                        ["balance"] = balance,
                        ["totalLoss"] = totalLoss
                    });
                });
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
            }
        }

        public void RegisterNewRound(string sessionId, string description)
        {
            CancelCurrentBets(sessionId, description);
            var userInfo = context.getUserInfo(sessionId);
            if (userInfo != null)
            {
                if (!userInfo.isPlayingForFun)
                {
                    reportTracker.Clear(context.Game.IdLong, userInfo.UserId);
                }
            }
            else
            {
                reportTracker.Clear(context.Game.IdLong, 0);
            }
        }

        public void RegisterSession(string sessionId)
        {
            var userInfo = context.getUserInfo(sessionId);
            if (userInfo != null)
            {
                userInfo.DidShowBalanceWarning = false;
            }

            requestBalance(sessionId);
        }

        public void Dispose()
        {
        }
    }
}