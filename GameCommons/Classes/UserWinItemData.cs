using Commons.Network.JSON;

namespace GameCommons.Classes
{
    public class UserWinItemData
    {
        private UserWinItemData()
        {
            
        }

        public UserWinItemData(long roundBetId, decimal amount, object winData, object winDataFull)
        {
            RoundBetId = roundBetId;
            Amount = amount;
            WinDataObject = winData;
            WinData = winData.SerializeJSON();
            WinDataFull = winDataFull.SerializeJSON();
        }

        public long RoundBetId { get; set; }
        public decimal Amount { get; set; }
        public object WinDataObject { get; set; }
        public string WinData { get; set; }
        public string WinDataFull { get; set; }

        public UserWinItemData Clone()
        {
            return new UserWinItemData {Amount = Amount, RoundBetId = RoundBetId, WinData = WinData, WinDataFull = WinDataFull, WinDataObject = WinDataObject};
        }
    }
}