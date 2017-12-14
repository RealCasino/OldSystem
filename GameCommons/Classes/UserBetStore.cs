using System.Collections.Generic;
using System.Linq;
using Commons.Enums;
using Commons.Network.JSON;

namespace GameCommons.Classes
{
    public class UserBetStore
    {
        private readonly object betLocker = new object();
        private readonly IDictionary<long, IDictionary<string, UserBet>> userBets = new Dictionary<long, IDictionary<string, UserBet>>();

        public long CurrentRoundId { get; private set; }

        //TODO: CURRENCY SWITCH IN THE MIDDLE OF THE ROUND?
        public UserBet MakeBet(long roundId, IDictionary<long, long> roundCounters, object betData, CurrencyTypeEnum currency, decimal amount, string comment)
        {
            CurrentRoundId = roundId;
            var serializedBetData = betData.SerializeJSON();
            UserBet userBet;

            lock (betLocker)
            {
                IDictionary<string, UserBet> roundBets;
                if (!userBets.TryGetValue(roundId, out roundBets))
                {
                    userBets.Add(roundId, roundBets = new Dictionary<string, UserBet>());
                }
                
                if (!roundBets.TryGetValue(serializedBetData, out userBet))
                {

                    if (!roundCounters.ContainsKey(roundId))
                    {
                        roundCounters.Add(roundId, 0);
                    }

                    roundBets.Add(serializedBetData, userBet = new UserBet
                    {
                        BetData = betData,
                        Currency = currency,
                        Amount = amount,
                        Comment = comment,
                        BetId = ++roundCounters[roundId]
                    });
                }
                else
                {
                    userBet = roundBets[serializedBetData];
                    userBet.Amount += amount;
                    userBet.Comment = comment;
                }
            }

            return userBet;
        }

        public decimal CancelBet(long roundId, object betData, decimal amount)
        {
            CurrentRoundId = roundId;
            var serializedBetData = betData.SerializeJSON();

            IDictionary<string, UserBet> roundBets;
            UserBet userBet;
            if (!userBets.TryGetValue(roundId, out roundBets) || !roundBets.TryGetValue(serializedBetData, out userBet))
            {
                return -1;
            }

            userBet.Amount -= amount;
            if (userBet.Amount < 0)
            {
                amount = amount + userBet.Amount;
                userBet.Amount = 0;
            }

            return amount;
        }

        public decimal CancelBets(long roundId)
        {
            CurrentRoundId = roundId;
            lock (betLocker)
            {
                IDictionary<string, UserBet> roundBets;
                if (!userBets.TryGetValue(roundId, out roundBets))
                {
                    return 0;
                }

                var totalSum = roundBets.Values.Sum(b => b.Amount);
                roundBets.Clear();
                return totalSum;
            }
        }

        public IList<UserBet> GetBets(long roundId)
        {
            lock (betLocker)
            {
                IDictionary<string, UserBet> roundBets;
                if (!userBets.TryGetValue(roundId, out roundBets))
                {
                    return new List<UserBet>();
                }

                return roundBets.Values.Where(b => b.Amount > 0).ToList();
            }
        }

        public bool IsEmpty(long roundId)
        {
            lock (betLocker)
            {
                return !userBets.ContainsKey(roundId) || userBets[roundId].Values.Sum(b => b.Amount) <= 0;
            }
        }
    }
}