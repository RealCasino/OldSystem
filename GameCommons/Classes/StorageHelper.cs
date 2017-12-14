using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using Commons.Data.NoSQL;
using Commons.DTO;
using Commons.Helpers;
using Commons.Log;

namespace GameCommons.Classes
{
    public class StorageHelper : IDisposable
    {
        private const int RESULT_WINNERS_LENGTH = 10;
        private const int MAX_WINNERS_LENGTH = 50;
        public const int WINNER_AGGREGATION_PERIOD = 5;
        private readonly object winLock = new object();
        private readonly List<IDictionary<string, object>> lastWinners = new List<IDictionary<string, object>>();
        private readonly List<IDictionary<string, object>> topWinners = new List<IDictionary<string, object>>();
        private readonly Dictionary<string, IDictionary<string, object>> tempWinners = new Dictionary<string, IDictionary<string, object>>();
        private readonly string storageId;
        private readonly ScriptedGameContext context;
        private bool isRunning;

        public StorageHelper(string storageId, ScriptedGameContext context)
        {
            this.storageId = storageId;
            this.context = context;
            try
            {
                var winners = NoSQLFacade.Get<NoSqlDictionarySet>("LastGameWinners", storageId);
                if (winners != null)
                {
                    lastWinners.AddRange(winners.Values);
                }
                
                winners = NoSQLFacade.Get<NoSqlDictionarySet>("TopGameWinners", storageId);
                if (winners != null)
                {
                    topWinners.AddRange(winners.Values);
                }
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
            }

            isRunning = true;
            var thread = new Thread(StorageBackgroundProc) {Name = "Storage background thread for {0}".FormatString(storageId)};
            thread.Start();
        }

        private void StorageBackgroundProc()
        {
            while (isRunning)
            {
                try
                {
                    lock (winLock)
                    {
                        foreach (var tempWinner in tempWinners.ToArray())
                        {
                            if (((DateTime)tempWinner.Value["date"]) < EnvironmentHelper.CurrentTime.Subtract(TimeSpan.FromSeconds(WINNER_AGGREGATION_PERIOD)))
                            {
                                context.sendSystemInternal(tempWinner.Key, SessionMessageTypeEnum.UserWin, new Dictionary<string, object>
                                {
                                    {"date", tempWinner.Value["date"]},
                                    {"currency", tempWinner.Value["currencyName"]},
                                    {"amount", tempWinner.Value["amount"]}
                                });

                                //context.Game.Runtime.NotifyExternalWinCallback(context.GetSession(tempWinner.Key), (DateTime)tempWinner.Value["date"], (string)tempWinner.Value["currencyName"], (decimal)tempWinner.Value["amount"]);
                                tempWinners.Remove(tempWinner.Key);
                            }
                        }
                        
                    }
                }
                catch (Exception ex)
                {
                    Logger.Log(ex);
                }
                finally
                {
                    Thread.Sleep(5000);
                }
            }
        }

        public void RegisterWin(UserInfo userInfo, decimal amount, object winData)
        {
            try
            {
                lock (winLock)
                {
                    IDictionary<string, object> winner;
                    if (tempWinners.ContainsKey(userInfo.sessionId) && EnvironmentHelper.CurrentTime.Subtract((DateTime) tempWinners[userInfo.sessionId]["date"]).TotalSeconds <= WINNER_AGGREGATION_PERIOD)
                    {
                        winner = tempWinners[userInfo.sessionId];
                        winner["amount"] = ((decimal) winner["amount"]) + amount;
                    }
                    else
                    {
                        winner = tempWinners[userInfo.sessionId] = new Dictionary<string, object>
                        {
                            {"id", userInfo.UserId},
                            {"nick", userInfo.nick},
                            //{"isExternal", userInfo.isExternal},
                            {"date", EnvironmentHelper.CurrentTime},
                            {"currencyName", userInfo.locale.currency},
                            {"currency", userInfo.locale.currencySign},
                            {"amount", amount}
                        };
                    }

                    if (!lastWinners.Contains(winner))
                    {
                        lastWinners.Insert(0, winner);
                        if (lastWinners.Count > MAX_WINNERS_LENGTH)
                        {
                            lastWinners.RemoveAt(lastWinners.Count - 1);
                        }
                    }

                    NoSQLFacade.Save("LastGameWinners", storageId, new NoSqlDictionarySet(lastWinners.ToArray()));

                    var index = topWinners.Count > MAX_WINNERS_LENGTH ? topWinners.FindIndex(w => ((decimal) w["amount"]) <= amount) : topWinners.Count;
                    if (index >= 0)
                    {
                        if (!topWinners.Contains(winner))
                        {
                            topWinners.Insert(index, winner);
                            if (topWinners.Count > MAX_WINNERS_LENGTH)
                            {
                                topWinners.RemoveAt(topWinners.Count - 1);
                            }
                        }

                        NoSQLFacade.Save("TopGameWinners", storageId, new NoSqlDictionarySet(topWinners.ToArray()));
                    }
                }
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
            }
        }

        public IDictionary<string, object>[] GetLastWinners()
        {
            return lastWinners.Take(RESULT_WINNERS_LENGTH).ToArray();
        }

        public bool saveData(string id, object data)
        {
            try
            {
                id = storageId.ConcatString("_", id);
                if (data == null)
                {
                    NoSQLFacade.Delete("GameDataRegistry", id);
                }

                var container = new GenericNoSqlObject(data);
                NoSQLFacade.Save("GameDataRegistry", id, container);
                return true;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return false;
            }
        }

        public object getData(string id)
        {
            try
            {
                id = storageId.ConcatString("_", id);
                var result = NoSQLFacade.Get<GenericNoSqlObject>("GameDataRegistry", id);
                return result?.Value;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                return null;
            }
        }

        public void Dispose()
        {
            isRunning = false;
        }
    }
}