using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection;
using Commons.Helpers;
using Commons.Network.HTTP;
using WebCommons.Classes.Games;

namespace GameCommons.Classes.Callbacks
{
    internal class CallbackWrapper
    {
        private static readonly string CALLBACK_USER_AGENT = "CasinoTV Gaming Core, v".ConcatString(Assembly.GetExecutingAssembly().GetName().Version);

        internal string SendCallbackMessage(GameCallbackData callbackData, string action, Dictionary<string, object> data)
        {
            var callbackUrl = callbackData.Url;
            var callbackToken = callbackData.Token;

            var queryString = "action=".ConcatString(action, String.Join("&", data.Select(d => $"{d.Key.EscapeUrlParameter()}={d.Value.ToString().EscapeUrlParameter()}")));
            callbackUrl = callbackUrl.ConcatString(queryString, action, "&signature=", callbackToken.ConcatString(queryString).ToSha256());

            using (var webClient = new TimeoutHttpRequest())
            {
                webClient.Headers[HttpRequestHeader.UserAgent] = CALLBACK_USER_AGENT;
                return webClient.DownloadString(callbackUrl);
            }
        }
    }
}
