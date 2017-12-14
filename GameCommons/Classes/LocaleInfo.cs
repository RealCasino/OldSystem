using System;
using System.Collections.Generic;
using Commons.Enums;
using Commons.Helpers;
using Commons.Log;

namespace GameCommons.Classes
{
    public class LocaleInfo
    {
        private static IDictionary<CurrencyTypeEnum, decimal> currencyMultipliers = new Dictionary<CurrencyTypeEnum, decimal>();

        public static void SetCurrencyMultipliers(IDictionary<CurrencyTypeEnum, decimal> multipliers)
        {
            currencyMultipliers = multipliers;
        }

        public LocaleInfo(string language, CurrencyTypeEnum currency)
        {
            this.language = language;
            this.CurrencyValue = currency;
            try
            {
                this.currency = currency.ToCurrencyName();
                this.currencySign = currency.ToCurrencySign();
                this.currencyMultiplier = currencyMultipliers.ContainsKey(currency) ? currencyMultipliers[currency] : 1.00m;
            }
            catch (Exception ex)
            {
                Logger.Log(ex);
            }
        }

        public string language { get; }

        public CurrencyTypeEnum CurrencyValue { get; }

        public string currency { get; }

        public string currencySign { get; }

        public decimal currencyMultiplier { get; } = 1.00m;
    }
}