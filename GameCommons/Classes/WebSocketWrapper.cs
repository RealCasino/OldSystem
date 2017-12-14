using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;
using Commons.Network.WebSockets;

namespace GameCommons.Classes
{
    //TODO Add init timeout
    public class WebSocketWrapper : IDisposable
    {
        public event Action<WebSocketWrapper, string, string, string> OnInitialize;
        public event Action<WebSocketWrapper> OnDisposed;
        private readonly WebSocketConnection connection;
        
        public WebSocketWrapper(WebSocketConnection connection)
        {
            this.connection = connection;
            connection.DataReceived += OnDataReceived;
            connection.OnDisconnected += OnDisconnected;
        }

        public bool IsDisposed { get; private set; }

        public void Initialize()
        {
            SendDataInternal(new Dictionary<string, object> { { "type", "ready" } });
        }

        private string OnDataReceived(WebSocketConnection source, string data)
        {
            try
            {
                var item = data.ParseJson();
                if (item != null)
                {
                    var packetType = (item.Evaluate<string>("type") ?? String.Empty).ToLower();
                    switch (packetType)
                    {
                        case "init":
                            OnInitialize?.Invoke(this, item.Evaluate<string>("instanceId"), item.Evaluate<string>("sessionToken"), item.Evaluate<string>("instanceToken"));
                            break;
                        case "message":
                            break;
                    }
                }

                return null;
            }
            catch (Exception ex)
            {
                Logger.Debug(ex);
                return new Dictionary<string, object>{{"type", "failure"}}.SerializeJSON();
            }
        }

        private void OnDisconnected(WebSocketConnection obj)
        {
            Dispose();
        }
        
        public bool SendData(object data)
        {
            return SendDataInternal(new Dictionary<string, object> { { "type", "message" }, { "data", data } });
        }

        private bool SendDataInternal(object data)
        {
            try
            {
                return connection.Send(data.SerializeJSON());
            }
            catch (Exception)
            {
                Dispose();
                return false;
            }
        }

        private void DisposeInternal()
        {
            try
            {

                SendDataInternal(new Dictionary<string, object> { { "type", "shutdown" } });
                Thread.Sleep(1000);
                connection.Dispose();
            }
            catch { }
        }

        public void Dispose()
        {
            if (!IsDisposed)
            {
                IsDisposed = true;
                connection.DataReceived -= OnDataReceived;
                connection.OnDisconnected -= OnDisconnected;
                Task.Run(() => DisposeInternal());
                OnDisposed?.Invoke(this);
            }
        }
    }
}
