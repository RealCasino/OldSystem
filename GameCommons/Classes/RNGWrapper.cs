using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using Commons.DTO;
using Commons.Helpers;
using Commons.Network.JSON;
using GameCommons.Helpers;

namespace GameCommons.Classes
{
    //TODO Add RNG logging
    //TODO Runtime can be null on game instance restart on file reload in shuffle method
    public class RNGWrapper
    {
        private static readonly RNGCryptoServiceProvider shuffleRandom = new RNGCryptoServiceProvider();
        private readonly ScriptedGameContext context;
        private readonly string sessionId;
        private readonly GameRandomHelper.GameRandom randomGenerator = GameRandomHelper.GetGameRandom();
        private Dictionary<string, object> hashPacket;
        private Dictionary<string, object> secretPacket;
        private string playerSeedValue;
        private bool canSetPlayerSeed;
        
        public RNGWrapper(ScriptedGameContext context, string sessionId)
        {
            this.context = context;
            this.sessionId = sessionId;
        }

        public string SessionId
        {
            get { return sessionId; }
        }

        public string initialShuffleString { get; private set; }
        public string serverSeed { get; private set; }
        public string serverHash { get; private set; }

        public string playerSeed
        {
            get { return playerSeedValue; }
            set
            {
                if (!canSetPlayerSeed)
                {
                    throw new Exception("RNG cannot accept player seed at this state.");
                }

                playerSeedValue = (value ?? String.Empty);
                if (playerSeedValue.Length > 32)
                {
                    playerSeedValue = playerSeedValue.Substring(0, 32);
                }
            }
        }

        public string finalShuffleString { get; private set; }

        public string random(string min, string max)
        {
            var minInt = min.ToInt();
            var maxInt = max.ToInt();
            return randomGenerator.Next(minInt, maxInt).ToString();
        }

        public string randomDouble(string min, string max)
        {
            var minDouble = min.ToDouble();
            var maxDouble = max.ToDouble();
            return randomGenerator.Next(minDouble, maxDouble).ToJsonNumber();
        }

        private object[] swapArray(object[] source, int sIndex)
        {
            if (sIndex == 0)
            {
                return source;
            }

            var lIndex = source.Length - sIndex;
            var result = new object[source.Length];
            Array.Copy(source, sIndex, result, 0, lIndex);
            Array.Copy(source, 0, result, lIndex, sIndex);
            return result;
        }

        public object shuffle(object source)
        {
            return shuffleInternal(source, 0);
        }

        public object spin(object source)
        {
            return shuffleInternal(source, 1);
        }

        public object shuffleInternal(object source, int mode)
        {
            var sourceObject = (source as IEnumerable<object>);
            if (sourceObject == null)
            {
                throw new NullReferenceException("Object sent to shuffle is null or not an array.");
            }

            var resultArray = sourceObject.ToArray();
            if (resultArray.Length == 0)
            {
                return resultArray;
            }

            var count = resultArray.Length - 1;
            var mt = GameRandomHelper.GetGameRandom();

            var cycles = mt.Next(1, count);

            switch (mode)
            {
                case 0:

                    for (var j = 0; j < cycles; j++)
                    {
                        for (var i = 0; i < resultArray.Length; i++)
                        {
                            var index = mt.Next(0, count);
                            var temp = resultArray[index];
                            resultArray[index] = resultArray[i];
                            resultArray[i] = temp;
                        }
                    }

                    break;
                case 1:

                    for (var i = 0; i < cycles; i++)
                    {
                        var index = mt.Next(0, count);
                        resultArray = swapArray(resultArray, index);
                    }

                    break;
            }


            if (context != null && context.Game.Runtime.isProvablyFair)
            {
                if (!String.IsNullOrEmpty(sessionId) && !String.IsNullOrEmpty(finalShuffleString))
                {
                    secretPacket = new Dictionary<string, object>
                    {
                        { "hash", serverHash },
                        { "initialShuffle", initialShuffleString },
                        { "finalShuffle", finalShuffleString },
                        { "serverSeed", serverSeed },
                        { "playerSeed", playerSeed },
                    };

                    context.sendSystemInternal(sessionId, SessionMessageTypeEnum.ProvablyFairServerSecret, secretPacket);
                }

                var buffer = new byte[32];
                shuffleRandom.GetNonZeroBytes(buffer);

                finalShuffleString = null;
                serverSeed = BitConverter.ToString(buffer).Replace("-", String.Empty);
                initialShuffleString = resultArray.SerializeJSON().Replace("\r", String.Empty).Replace("\n", String.Empty).Replace("\t", String.Empty);
                serverHash = String.Concat(serverSeed, initialShuffleString).ToSha256();

                if (!String.IsNullOrEmpty(sessionId))
                {
                    hashPacket = new Dictionary<string, object> { { "hash", serverHash } };
                    context.sendSystemInternal(sessionId, SessionMessageTypeEnum.ProvablyFairServerHash, hashPacket);
                }

                canSetPlayerSeed = true;
            }

            return resultArray;
        }

        public object finalShuffle(object source)
        {
            return finalShuffleInternal(source, 0);
        }

        public object finalSpin(object source)
        {
            return finalShuffleInternal(source, 1);
        }

        public object finalShuffleInternal(object source, int mode)
        {
            var sourceObject = (source as IEnumerable<object>);
            if (sourceObject == null)
            {
                throw new NullReferenceException("Object sent to final shuffle is null or not an array.");
            }

            var resultArray = sourceObject.ToArray();
            if (resultArray.Length == 0)
            {
                return resultArray;
            }

            GameRandomHelper.GameRandom mt;
            if(context != null && context.Game.Runtime.isProvablyFair)
            {
                canSetPlayerSeed = false;
                var seedSha = String.Concat(playerSeed, serverSeed).ToSha256Bytes();
                UInt32 seed = 0;
                for (var i = 0; i < 4; i++)
                {
                    seed = (seed * 256) + seedSha[i];
                }

                mt = GameRandomHelper.GetGameRandom(seed);
            }
            else
            {
                mt = GameRandomHelper.GetGameRandom();
            }

            var count = resultArray.Length - 1;
            switch (mode)
            {
                case 0:
                    for (int i = 0; i < resultArray.Length; i++)
                    {
                        var index = mt.Next(0, count);
                        var temp = resultArray[index];
                        resultArray[index] = resultArray[i];
                        resultArray[i] = temp;
                    }

                    break;
                case 1:
                    {
                        var index = mt.Next(0, count);
                        resultArray = swapArray(resultArray, index);
                    }
                    break;
            }

            if (context != null && context.Game.Runtime.isProvablyFair)
            {
                finalShuffleString = resultArray.SerializeJSON().Replace("\r", String.Empty).Replace("\n", String.Empty).Replace("\t", String.Empty);
            }

            return resultArray;
        }
        
        public void CheckOldSession()
        {
            if (secretPacket != null)
            {
                context.sendSystemInternal(sessionId, SessionMessageTypeEnum.ProvablyFairServerSecret, secretPacket);
            }

            if (hashPacket != null)
            {
                context.sendSystemInternal(sessionId, SessionMessageTypeEnum.ProvablyFairServerHash, hashPacket);
            }
        }

        public RNGWrapper createNew()
        {
            return new RNGWrapper(context, sessionId);
        }
    }
}