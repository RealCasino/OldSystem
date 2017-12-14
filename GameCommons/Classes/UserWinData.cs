using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Commons.Enums;

namespace GameCommons.Classes
{
    public class UserWinData
    {
        public UserWinData(long roundId, bool seamlessMode, long casinoId, long userId, long accountId, long accessPointId, string externalSessionId, string externalSessionIp, CurrencyTypeEnum currency, string clientType, bool isPlayingForFun)
        {
            RoundId = roundId;
            SeamlessMode = seamlessMode;
            CasinoId = casinoId;
            UserId = userId;
            AccountId = accountId;
            AccessPointId = accessPointId;
            ExternalSessionId = externalSessionId;
            ExternalSessionIp = externalSessionIp;
            Currency = currency;
            ClientType = clientType;
            IsPlayingForFun = isPlayingForFun;
        }

        public List<UserWinItemData> WinData { get; set; } = new List<UserWinItemData>();

        public long RoundId { get; set; }
        public bool SeamlessMode { get; set; }
        public long CasinoId { get; set; }
        public long UserId { get; set; }
        public long AccountId { get; set; }
        public long AccessPointId { get; set; }
        public string ExternalSessionId { get; set; }
        public string ExternalSessionIp { get; set; }
        public CurrencyTypeEnum Currency { get; set; }
        public string ClientType { get; set; }
        public object SuccessCallback { get; set; }
        public object FailureCallback { get; set; }
        public bool IsPlayingForFun { get; set; }

        public UserWinItemData[] GetWinsInGroup()
        {
            var result = new List<UserWinItemData>();
            var data = WinData.GroupBy(g => g.RoundBetId).ToArray();
            foreach (var userWinItemData in data)
            {
                var resultItem = userWinItemData.First().Clone();
                resultItem.Amount = userWinItemData.Sum(r => r.Amount);
                result.Add(resultItem);
            }

            return result.ToArray();
        }
    }
}