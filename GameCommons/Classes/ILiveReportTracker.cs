using System.Collections.Generic;

namespace GameCommons.Classes
{
    public interface ILiveReportTracker 
    {
        void Register(long gameId, long casinoId, long userId);
        void Add(long casinoId, long gameId, long userId, Dictionary<string, object> dictionary);
        void Clear(long gameId, long userId);
    }
}