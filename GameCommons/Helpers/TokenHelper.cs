using System;
using System.Linq;
using System.Text;
using Commons.Helpers;
using WebCommons.Classes.Games;
using WebCommons.Services;

namespace GameCommons.Helpers
{
    public static class TokenHelper
    {
        public static string CreateServiceAppToken(long appId, long casinoId, int applicationType, string code)
        {
            var stringBuilder = new StringBuilder();
            stringBuilder.Append(appId);
            stringBuilder.Append(":");
            stringBuilder.Append(casinoId);
            stringBuilder.Append(":");
            stringBuilder.Append(applicationType);
            stringBuilder.Append(":");
            stringBuilder.Append(code);
            var data = stringBuilder.ToString();
            var bytes = Encoding.UTF8.GetBytes(data).Reverse();
            var hex = new StringBuilder();
            foreach (var b in bytes)
            {
                hex.AppendFormat("{0:x2}", b);
            }

            return hex.ToString();
        }

        public static ServiceApplicationInfo ParseServiceAppToken(string token)
        {
            var result = new ServiceApplicationInfo
            {
                CasinoId = 0,
                ApplicationType = 1
            };

            string[] parsedData;

            try
            {
                var bytes = Enumerable.Range(0, token.Length).Where(x => x % 2 == 0).Select(x => Convert.ToByte(token.Substring(x, 2), 16)).ToArray();
                var reversedBytes = bytes.Reverse().ToArray();
                parsedData = Encoding.UTF8.GetString(reversedBytes).Split(new []{':'}, 4);
            }
            catch (Exception ex)
            {
                throw new Exception("Invalid token");
            }

            try
            {
                if (parsedData.Length < 4)
                {
                    throw new Exception("Wrong token length");
                }

                var appId = parsedData[0].ToLong();
                var code = parsedData[3];

                result = ExternalServiceFacade.GetGameCoreService().GetServiceApplicationInfo(appId, code);
            }
            catch (Exception ex)
            {
                throw new Exception("Wrong token version");
            }

            return result;
        }

        public static string CreateGameSessionToken(string sessionId, string magic)
        {
            return new string("{0}:{1}".FormatString(sessionId, magic).ToBase64().Replace('=', '_').Reverse().ToArray()).UrlEscape();
        }

        public static bool ParseGameSessionToken(string token, out string sessionId, out string magic)
        {
            sessionId = null;
            magic = null;
            if (string.IsNullOrEmpty(token))
            {
                return false;
            }

            try
            {
                var items = new string(token.UrlUnescape().Replace('_', '=').Reverse().ToArray()).FromBase64().Split(new[] { ':' }, 2);
                sessionId = items[0];
                magic = items[1];

                return !string.IsNullOrEmpty(magic);
            }
            catch { }

            return false;
        }
    }
}

