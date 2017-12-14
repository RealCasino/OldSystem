using System;
using System.Collections.Generic;
using Commons.DTO;
using Commons.Enums;

namespace GameCommons.Classes
{
    public interface IAccountingFacade
    {
        decimal GetBalance(long gameId, long accountId, long userId, long accessPointId, bool seamless, string clientType);
        decimal MakeBets(long gameId, long casinoId, long userId, long accountId, long roundId, BetData[] gameData, string externalSessionId, string externalSessionIp, long accessPointId, bool seamless, string clientType);
        decimal RegisterPlayerWins(long gameId, long casinoId, long userId, long accountId, long roundId, UserWinData winData, long accessPointId, string externalSessionId, string externalSessionIp, bool seamlessMode, string clientType);
        IDictionary<string, object>[] GetRoundBets(long gameId, long roundId);
        void UpdateGameIncome(long casinoId, long gameId, DateTime date, CurrencyTypeEnum currency, decimal amountBet, decimal amountWin, bool isReal);
        void RegisterRoundOpen(long gameId, long roundId);
        void RegisterRoundClosed(long gameId, long roundId);
        void RegisterRoundResult(long gameId, long roundId, object result);
        void OverrideRoundResult(long gameId, long roundId, object result);
        void CancelRound(long gameId, long roundId, bool cancelBets);
    }
}