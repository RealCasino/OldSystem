using System.Collections.Generic;
using System.ServiceModel;

namespace GameCommons.Classes.WCF
{
    [ServiceContract]
    public interface IExternalGameInfoService
    {
        [OperationContract]
        Dictionary<string, object> GetGameInfo(long gameId, string gameType, string gameName,  long casinoId, long userId, long referenceId);
        [OperationContract]
        Dictionary<string, Dictionary<string, object>> GetGamesInfo(long casinoId, long userId, long referenceId);
        [OperationContract]
        Dictionary<string, object> GetOfflineGameInfo(string gameName, long casinoId, long userId, long referenceId);
    }
}