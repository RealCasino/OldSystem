using System;
using System.Collections.Generic;
using Commons.DTO;
using Commons.Enums;
using Commons.Helpers;
using Commons.Network.JSON;

namespace GameCommons.Classes
{
    public class UserInfo : IDisposable
    {
        private static readonly string[] firstNames = {"A.", "C.", "D.", "E.", "F.", "J.", "K.", "M.", "N.", "P.", "O.", "R.", "S.", "T.", "W."};
        private static readonly string[] lastNames = {"PATTERSON", "PETERSON", "BURNS", "BLACK", "FULLER", "CARPENTER", "PERKINS", "HARVEY", "COLLEGE", "MYERS", "ELLIOTT", "FREEMAN", "ROSE", "TUCKER", "WOODS", "PAYNE", "LLOYD", "DIXON", "OWEN", "HOPKINS", "PIERCE", "NEWTON", "BRADLEY", "WILKINSON", "CARR", "CURTIS", "PEARSON", "FELLOWS", "CRAWFORD", "FRENCH", "BALL", "BISHOP", "NICHOLS", "BALDWIN", "POTTER", "BURTON", "RYAN", "BERRY", "HUDSON", "FRANK", "DEAN", "WARNER", "PRATT", "MATTHEWS", "GILBERT", "HOUSE", "SHERMAN", "BOOTH", "BRIEN", "COLEMAN", "HAWKINS", "PARSONS", "DOUGLAS", "MORRISON", "AUSTIN", "BRYAN", "FRANKLIN", "DAWSON", "FIELD", "NEWMAN", "GRIFFIN", "PARK", "FRANCIS", "WALSH", "BURKE", "WILLIAMSON", "MORTON", "BATES", "GEO", "HOLLAND", "BARRETT", "OLIVER", "HALE", "HOWE", "SHARP", "MARSH", "FERGUSON", "ATKINSON", "NORTON", "GOULD", "STEPHENS", "DAVIDSON", "SIMMONS", "SNYDER", "FOWLER", "SANDERS", "HARPER", "CLAY", "BRYANT", "BARBER", "RILEY", "CARROLL", "CROSS", "BARTON", "CHARLES", "HOLT", "BOYD", "LITTLE", "PETERS", "IT", "CUNNINGHAM", "WATTS", "STEVENSON", "REID", "MANN", "SAUNDERS", "GRIFFITHS", "WILLIS", "ELIZABETH", "JORDAN", "DUNCAN", "HAMMOND", "STUART", "THOMSON", "LYNCH", "OWENS", "CONNOR", "HUTCHINSON", "HICKS", "WALTER", "STANLEY", "HOWELL", "WALTON", "GREGORY", "WEAVER", "SUTTON", "PAUL", "WELCH", "MILES", "GOODWIN", "COOKE", "CHAS", "BLAKE", "TODD", "KELLEY", "LEONARD", "HARDING", "CHANDLER", "ABBOTT", "ROBERT", "JANE", "CHAMBERS", "JOSEPH", "JENNINGS", "WADE", "BIRD", "GILL", "LOWE", "WATKINS"};

        public const decimal FUN_BALANCE = 10000m;
        private readonly object balanceLock = new object();
        private readonly IDictionary<string, object> sessionValue = new Dictionary<string, object>();
        private string userNick;
        private RNGWrapper rngValue;
        private decimal previousBalance;
        private bool isBalanceFailed;
        
        public ScriptedGameContext context { get; }
        public string sessionId { get; }

        public long UserId { get; }

        public long CasinoId { get; }

        public string ExternalSessionId { get; }

        public string ExternalSessionIp { get; }

        public string clientId { get; private set; }

        public bool DidShowBalanceWarning { get; set; }

        public UserInfo(ScriptedGameContext context, string sessionId, long userId, long accountId, long casinoId, string externalSessionId, string externalSessionIp, string clientId, string locale, CurrencyTypeEnum currency, string nick, string clientType, IDictionary<string, object> features)
        {
            this.context = context;
            this.sessionId = sessionId;
            UserId = userId;
            CasinoId = casinoId;
            ExternalSessionId = externalSessionId;
            ExternalSessionIp = externalSessionIp;
            this.clientId = clientId;
            UserNick = nick;
            AccountId = accountId;
            ClientType = clientType;
            this.features = features;
            this.locale = new LocaleInfo(locale, currency);

            ExternalId = Guid.NewGuid().ToString().Replace("-", String.Empty).ToLower();

            if (userId != 0)
            {
                isLoggedIn = true;
            }

            if (isPlayingForFun)
            {
                Balance = FUN_BALANCE;
            }
        }

        public string ClientType { get; set; }

        public string ExternalId { get; private set; }

        public long AccountId { get; }

        public string UserNick
        {
            get { return userNick; }
            set { userNick = String.IsNullOrEmpty(value) ? userNick ?? GenerateNick() : value; }
        }

        private string GenerateNick()
        {
            return $"{firstNames[RandomHelper.Random.Next(0, firstNames.Length - 1)]} {lastNames[RandomHelper.Random.Next(0, lastNames.Length - 1)].ToTitleString()}";
        }

        [JSONPath("isLoggedIn")]
        public bool isLoggedIn { get; }

        [JSONPath("nick")]
        public string nick => userNick ?? string.Empty;

        [JSONPath("balance")]
        public string balance
        {
            get
            {
                if (isBalanceFailed)
                {
                    isBalanceFailed = false;
                    context?.accountingHelper?.requestBalance(sessionId);
                }

                return Balance.ToJsonNumber();
            }
            set { Balance = value.ToDecimal(); }
        }

        public IDictionary<string, object> features { get; }
        public decimal totalBetAmount { get; set; }
        public decimal roundWinAmount { get; set; }
        public decimal totalWinAmount { get; set; }

        public decimal totalLoss
        {
            get
            {
                var loss = totalBetAmount - totalWinAmount;
                return loss < 0 ? 0 : loss;
            }
        }

        public bool Seamless => features.ContainsKey("seamless");

        public long AccessPointId
        {
            get
            {
                object id;
                if (features.TryGetValue("external_access_point", out id))
                {
                    return id.ToString().ToLong(-1);
                }

                return -1;
            }
        }

        public decimal Balance { get; set; }

        public void SetBalance(decimal balance)
        {
            lock (balanceLock)
            {
                previousBalance = Balance = balance;
            }
        }

        public void SetClientId(string clientId)
        {
            this.clientId = clientId;
        }

        public void Reset()
        {
            if (isPlayingForFun)
            {
                Balance = FUN_BALANCE;
            }
        }

        public void RefreshBalance()
        {
            if (isPlayingForFun)
            {
                return;
            }

            lock (balanceLock)
            {
                try
                {
                    isBalanceFailed = false;
                    var newBalance = context.AccountingFacade.GetBalance(context.Game.IdLong, AccountId, UserId, AccessPointId, Seamless, ClientType);
                    Balance += newBalance - previousBalance;
                    if (Balance < 0)
                    {
                        Balance = 0;
                    }

                    if (newBalance != previousBalance)
                    {
                        context.accountingHelper.SendBalanceChanged(sessionId, Balance, totalLoss);
                    }

                    previousBalance = newBalance;
                    CheckUserState();
                }
                catch (Exception ex)
                {
                    isBalanceFailed = true;
                    context.Game.LogError(ex);
                }
            }
        }

        public void CheckUserState()
        {
            var warningAmount = features.Evaluate<decimal>("balance_warning_limit");
            if (warningAmount > 0 && Balance < warningAmount)
            {
                if (!DidShowBalanceWarning)
                {
                    DidShowBalanceWarning = true;
                    context.sendSystemInternal(sessionId, SessionMessageTypeEnum.Popup, new Dictionary<string, object> { {"popup", features.Evaluate("balance_warning_popup", "balance_warning_popup") } });
                }
            }
        }

        [JSONPath("isPlayingForFun")]
        public bool isPlayingForFun => !isLoggedIn || AccountId == 0;

        public IDictionary<string, object> session
        {
            get { return sessionValue; }
            set { throw new Exception("You can't set session value directly, you should set values within it.");}
        }

        public LocaleInfo locale { get; internal set; }

        public object settings
        {
            get { return context.loadUserSettings(sessionId); }
            set { context.saveUserSettings(sessionId, value); }
        }

        public RNGWrapper rng => rngValue ?? (rngValue = new RNGWrapper(context, sessionId));

        public string Username => UserNick;

        public void Dispose()
        {
        }
    }
}