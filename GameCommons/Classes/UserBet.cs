using Commons.Enums;

namespace GameCommons.Classes
{
    public class UserBet
    {
        public CurrencyTypeEnum Currency { get; set; }
        public decimal Amount { get; set; }

        public object BetData { get; set; }

        public string Comment { get; set; }

        public long BetId { get; set; }
    }
}