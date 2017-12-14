namespace GameCommons.Classes
{
    public enum ServerMessageTypeEnum
    {
        override_round = 1000,
        cancel_round = 1010,
        close_round = 1020,
        disable_instance = 1030,
        enable_instance = 1031,
        refresh_user_data = 1050,
        reload_vod_data = 1100,
    }
}