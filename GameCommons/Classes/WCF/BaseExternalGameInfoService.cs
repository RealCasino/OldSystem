using System.Collections.Generic;
using Commons.Network.WCF;

namespace GameCommons.Classes.WCF
{
    public abstract class BaseExternalGameInfoService : IExternalGameInfoService
    {
        private static SimpleWCFClient<IExternalGameInfoService> gateway;
        public const string THUMBNAIL_URL = "thumbnail";
        public const string BACKGROUND_URL = "background";
        public const string FEATURED_URL = "featured";
        public const string INTRO_VIDEO_URL = "intro_video";
        public const string RULES_URL = "rules";
        public const string OFFLINE_IMAGE = "offline_image";

        public static void Initialize(string sourceUrl)
        {
            gateway = new SimpleWCFClient<IExternalGameInfoService>(sourceUrl);
        }

        public static IExternalGameInfoService Gateway => gateway.CreateChannel();


        public abstract Dictionary<string, object> GetGameInfo(long gameId, string gameType, string gameName, long casinoId, long userId, long referenceId);
        public abstract Dictionary<string, object> GetOfflineGameInfo(string gameName, long casinoId, long userId, long referenceId);
        public abstract Dictionary<string, Dictionary<string, object>> GetGamesInfo(long casinoId, long userId, long referenceId);
    }
}