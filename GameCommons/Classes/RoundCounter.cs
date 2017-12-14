using System;
using Commons.Data.NoSQL;
using WebCommons.Services;

namespace GameCommons.Classes
{
    public class RoundCounter : IDisposable
    {
        private readonly ScriptedGameContext context;
        private readonly long gameId;
        private long currentValue;
        private bool hasUnsyncedValues;

        public RoundCounter(ScriptedGameContext context)
        {
            this.context = context;
            gameId = context.Game.IdLong;

            currentValue = ExternalServiceFacade.GetGameCoreService().GetRoundId(gameId);
            if (currentValue == 0)
            {
                currentValue = increase();
            }

            var tmpResult = NoSQLFacade.Get<GenericNoSqlObject>("SavedGameRoundId", context.Game.IdLong);
            if (tmpResult != null)
            {
                var longValue = (long) tmpResult.Value;
                if (currentValue < longValue)
                {
                    context.Game.Log("Restoring round counter from NoSQL storage from value {0} to value {1}", currentValue, longValue);
                    currentValue = longValue;
                    hasUnsyncedValues = true;
                    CheckSync();
                    NoSQLFacade.Delete("SavedGameRoundId", context.Game.IdLong);
                }
            }
        }

        public long increase()
        {
            try
            {
                CheckSync();
                currentValue = ExternalServiceFacade.GetGameCoreService().IncreaseRoundId(gameId);
                return currentValue;
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
                SaveRoundIdToNoSql();
                hasUnsyncedValues = true;
                return currentValue++;
            }
        }

        private void CheckSync()
        {
            if (hasUnsyncedValues)
            {
                try
                {
                    ExternalServiceFacade.GetGameCoreService().SetRoundId(gameId, currentValue);
                    hasUnsyncedValues = false;
                }
                catch (Exception ex)
                {
                    SaveRoundIdToNoSql();
                    context.Game.LogError(ex);    
                }
            }
        }

        private void SaveRoundIdToNoSql()
        {
            try
            {
                NoSQLFacade.Save("SavedGameRoundId", context.Game.IdLong, new GenericNoSqlObject(currentValue));
            }
            catch (Exception ex)
            {
                context.Game.LogError(ex);
            }
        }

        public long current
        {
            get
            {
                CheckSync();
                return currentValue;
            }
        }

        public void Dispose()
        {
            CheckSync();
            if (hasUnsyncedValues)
            {
                context.Game.Log("Error! The game round counter couldn't be updated in database, actual round id set to {0}", currentValue);
            }
        }
    }
}
