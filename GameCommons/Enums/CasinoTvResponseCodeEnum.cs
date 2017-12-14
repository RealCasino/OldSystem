namespace GameCommons.Enums
{
    public enum CasinoTvResponseCodeEnum
    {
        OK = 0, 
        GenericError = 1,
        GameNotAvailable = 50,
        SessionExpired = 100, 
        LoginRequired = 110, 
        InsufficientBalance = 120
    }
}
