using System;
using System.Linq;
using System.Threading;
using Commons.Network.WCF;

namespace GameCommons.Classes
{
    public class ExternalDatasource : IDisposable
    {
        private readonly ScriptedGameContext context;
        private DataExchangeClient exchangeClient;
        private readonly string datasourceId;
        private readonly Timer processTimer;
        private object previousItem;
        private bool isChanged;

        private static void OnChangeCheck(object state)
        {
            var datasource = (ExternalDatasource) state;
            var item = datasource.current;
            if (((datasource.previousItem == null && item != null) || (datasource.previousItem != null && !datasource.previousItem.Equals(item))))
            {
                datasource.previousItem = item;
                datasource.isChanged = true;
            }
        }

        public ExternalDatasource(ScriptedGameContext context, Uri exchangeClientUri, string datasourceId)
        {
            this.context = context;
            this.exchangeClient = new DataExchangeClient(exchangeClientUri);
            this.datasourceId = datasourceId;
            exchangeClient.GetCurrent(datasourceId);
            processTimer = new Timer(OnChangeCheck, this, TimeSpan.FromSeconds(1), TimeSpan.FromMilliseconds(500));
        }

        public object onChangeEvent { get; set; }

        public object current
        {
            get
            {
                var message = exchangeClient.GetCurrent(datasourceId);
                return message?.Data;
            }
        }
        
        public object[] pick()
        {
            return exchangeClient.Pick(datasourceId).Select(s => s.Data).ToArray();
        }

        public void Process()
        {
            var changedEvent = onChangeEvent;
            if (changedEvent == null)
            {
                isChanged = false;
            }
            else if (isChanged)
            {
                isChanged = false;
                context.Game.ExecuteCallback(this, changedEvent, false, this);
            }
        }

        public void Dispose()
        {
            processTimer.Dispose();

            if (exchangeClient != null)
            {
                exchangeClient.Dispose();
                exchangeClient = null;
            }
        }
    }
}