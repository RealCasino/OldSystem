using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Commons.DTO;
using Commons.Helpers;
using Commons.Log;
using Commons.Network.JSON;

namespace GameCommons.Classes
{
    public class GameMediaHelper
    {
        private class MediaSession
        {
            public VODItem[] CurrentVOD { get; set; }
            public IDictionary<string, object> CurrentScreenPacket;
            public readonly IDictionary<string, object> Overlays = new Dictionary<string, object>();

            public void SendInitialPackets(ScriptedGameContext scriptedGameContext, string sessionId)
            {
                var items = CurrentVOD;
                var itemsToPlay = items?.Where(i => !i.HasEnded).ToList();
                if (itemsToPlay?.Count > 0)
                {
                    foreach (var item in itemsToPlay)
                    {
                        if (item.HasStarted)
                        {
                            item.Data["offset"] = EnvironmentHelper.CurrentTime.Subtract(item.DateStart).TotalMilliseconds - 1000;
                        }
                    }

                    var packet = new Dictionary<string, object>
                    {
                        {"vodType", (int) VodPacketTypeEnum.Play},
                        {"target", "background"},
                        {"items", itemsToPlay.Select(i => i.Data).ToArray()}
                    };

                    scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
                }

                var lastPacket = CurrentScreenPacket;
                if (lastPacket != null)
                {
                    scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, lastPacket);
                }

                var lastOverlays = Overlays.Values.ToArray();
                if (lastOverlays.Length > 0)
                {
                    var packet = new Dictionary<string, object>
                    {
                        {"vodType", (int) VodPacketTypeEnum.Play},
                        {"target", "overlay"},
                        {"items", lastOverlays}
                    };

                    scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
                }
            }
        }

        private class VODItem
        {
            public VODItem()
            {
                Length = TimeSpan.Zero;
                Offset = TimeSpan.Zero;
            }

            public IDictionary<string, object> Data { get; set; }

            public bool HasStarted
            {
                get { return EnvironmentHelper.CurrentTime.Subtract(DateStart).TotalSeconds > 1; }     
            }

            public bool HasEnded
            {
                get { return !IsLooped && EnvironmentHelper.CurrentTime.Subtract(DateStart).TotalSeconds - 2 > Length.TotalSeconds; }
            }

            public DateTime DateStart { get; set; }
            public TimeSpan Length { get; set; }
            public TimeSpan Offset { get; set; }
            public bool IsLooped { get; set; }
            
        }

        public const int MAX_OVERLAYS_HISTORY = 10;

        private readonly object mediaSessionsLock = new object();
        private readonly MediaSession defaultSession = new MediaSession();
        private readonly Dictionary<string, MediaSession> mediaSessions = new Dictionary<string, MediaSession>();
        private readonly ScriptedGameContext scriptedGameContext;
        private IDictionary<string, object> virtualDataValue;
        private Dictionary<string, object> streamData;
        private IDictionary<string, object> screenMap;
        private IDictionary<string, object> vodDataValue;
        private IDictionary<string, object> lengthMap;
        private IDictionary<string, object> overlayMap;
        private IDictionary<string, object> clientData;
        private string virtualType;

        public GameMediaHelper(ScriptedGameContext scriptedGameContext, IDictionary<string, object> vodData, IDictionary<string, object> virtualData, IDictionary<string, object> streamConfig, bool hasLiveStreams)
        {
            this.scriptedGameContext = scriptedGameContext;
            LoadVOD(vodData);
            LoadVirtualData(virtualData);
            SetStreamConfig(streamConfig);
            this.hasLiveStreams = hasLiveStreams;
        }

        internal void LoadVOD(IDictionary<string, object> vodData)
        {
            vodData = vodData ?? new Dictionary<string, object>();
            vodDataValue = vodData;

            streamData = null;
            overlayMap = null;
            screenMap = vodData.ContainsKey("screens") ? vodData["screens"] as IDictionary<string, object> : null;
            var overlayMapCollection = vodData.ContainsKey("overlay") ? vodData["overlay"] as IDictionary<string, object> : null;
            lengthMap = vodData.ContainsKey("length_map") ? vodData["length_map"] as IDictionary<string, object> : null;

            if (vodData.Count > 0)
            {
                var data = (vodData.ContainsKey("stream_data") ? vodData["stream_data"] as IDictionary<string, object> : null) ?? new Dictionary<string, object>
                {
                    {
                        "quality", new Dictionary<string, object>
                        {
                            {"mp4", new[] {"sq"}},
                            {"ogv", new[] {"sq"}},
                        }
                    }
                };

                streamData = new Dictionary<string, object> { { "vodType", (int)VodPacketTypeEnum.StreamInfo }, { "stream_data", data } };
            }

            if (overlayMapCollection != null)
            {
                overlayMap = new Dictionary<string, object>();
                foreach (var item in overlayMapCollection)
                {
                    overlayMap[item.Key.Replace('\\', '/')] = item.Value;
                }
            }

            if (vodData.ContainsKey("clients"))
            {
                var clientInfo = vodData["clients"] as IDictionary<string, object>;
                if (clientInfo != null)
                {
                    clientData = new Dictionary<string, object>();
                    foreach (var item in clientInfo)
                    {
                        clientData[item.Key.ToLower()] = item.Value;
                    }
                }
            }
        }

        public IDictionary<string, object> streamConfig { get; private set; }

        internal void LoadVirtualData(IDictionary<string, object> data)
        {
            virtualDataValue = data ?? new Dictionary<string, object>();
            virtualType = data.Evaluate<string>("type");

            ExternalVirtualData = virtualDataValue.Count < 1 ? null : new Dictionary<string, object>
            {
                { "type", virtualType},
                { "loader", data.Evaluate<IDictionary<string, object>>("loader") },
            };
        }

        private IDictionary<string, object> GetVideoInfo(string name)
        {
            if (String.IsNullOrEmpty(name))
            {
                return null;
            }

            try
            {
                var nameItems = name.Split(new[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries);
                var map = lengthMap;
                for (var i = 0; i < nameItems.Length - 1; i++)
                {
                    if (map != null && map.ContainsKey(nameItems[i]))
                    {
                        map = map[nameItems[i]] as IDictionary<string, object>;
                    }
                    else
                    {
                        map = null;
                    }
                }

                var fileName = nameItems.Last();
                if (map != null && map.ContainsKey(fileName))
                {
                    return new Dictionary<string, object> { { "length", map[fileName] } };
                }      
            }
            catch (Exception ex)
            {
                scriptedGameContext.logError(ex);
            }

            return null;
        }

        public void RegisterSession(string sessionId)
        {
            if (streamData != null)
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, streamData);
            }

            MediaSession session;
            lock (mediaSessionsLock)
            {
                if (!mediaSessions.ContainsKey(sessionId))
                {
                    mediaSessions[sessionId] = new MediaSession();
                }

                session = mediaSessions[sessionId];
            }

            defaultSession.SendInitialPackets(scriptedGameContext, sessionId);
            session.SendInitialPackets(scriptedGameContext, sessionId);
        }

        public void UnregisterSession(string sessionId)
        {
            lock (mediaSessionsLock)
            {
                if (mediaSessions.ContainsKey(sessionId))
                {
                    mediaSessions.Remove(sessionId);
                }
            }
        }

        public object vodData => vodDataValue;

        public object virtualData => virtualDataValue;

        public IDictionary<string, object> ExternalVirtualData { get; private set; }

        public string mode => vodDataValue.Count < 1 ? virtualDataValue.Count < 1 ? "None" : "Virtual" : "VOD";

        public bool isEmpty => hasNoVOD && !hasLiveStreams;

        public bool hasNoVOD => virtualDataValue.Count < 1 &&  vodDataValue.Count < 1;

        public bool hasLiveStreams { get; }
        
        public object getVODInfo(string name)
        {
            return GetVideoInfo(name);
        }

        private MediaSession GetMediaSession(string sessionId)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            if (!hasEmptySession)
            {
                lock (mediaSessionsLock)
                {
                    return mediaSessions.ContainsKey(sessionId) ? mediaSessions[sessionId] : null;
                }
            }

            return defaultSession;
        }

        public void showOverlay(string sessionId, object overlay)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var items = new List<IDictionary<string, object>>();
            var item = overlay as IDictionary<string, object>;
            string name = null;
            if (item != null)
            {
                if (!item.ContainsKey("name") || item["name"] == null)
                {
                    throw new Exception("Required field 'name' is not provided");
                }

                name = item["name"].ToString();
            }
            else
            {
                name = overlay.ToString();
                item = new Dictionary<string, object> {{"name", name}};
            }
            
            if (overlayMap != null)
            {
                var path = name.Replace('\\', '/');
                while (!String.IsNullOrEmpty(path))
                {
                    if (overlayMap.ContainsKey(path))
                    {
                        var overlayItem = overlayMap[path] as IDictionary<string, object>;
                        if (overlayItem != null)
                        {
                            foreach (var configItem in overlayItem)
                            {
                                if (!item.ContainsKey(configItem.Key))
                                {
                                    switch (configItem.Key)
                                    {
                                        case "path":
                                            var nameOnly = Path.GetFileName(name);
                                            var fullPath = configItem.Value.ToString().Replace('\\', '/').TrimEnd('/').ConcatString("/", nameOnly);
                                            item[configItem.Key] = fullPath;
                                            break;
                                        case "overlayType":
                                            switch (configItem.Value.ToString().ToLower())
                                            {
                                                case "media":
                                                    break;
                                                case "winners":
                                                    item["items"] = scriptedGameContext.storageHelper.GetLastWinners();
                                                    break;
                                            }
                                            break;
                                        default:
                                            item[configItem.Key] = configItem.Value;
                                            break;
                                    }
                                }
                            }
                        }

                        break;
                    }

                    path = (Path.GetDirectoryName(path) ?? String.Empty).Replace('\\', '/');
                }
            }

            if (!item.ContainsKey("overlayType"))
            {
                item["overlayType"] = "media";
            }

            items.Add(item);

            var packet = new Dictionary<string, object>
            {
                {"vodType", (int) VodPacketTypeEnum.Play},
                {"target", "overlay"},
                {"items", items.ToArray()}
            };

            var session = GetMediaSession(sessionId);
            if (session != null)
            {
                var overlays = session.Overlays;
                if (overlays.Count > MAX_OVERLAYS_HISTORY)
                {
                    overlays.Clear();
                }

                overlays[name] = item;
            }

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.VOD, packet);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
            }
        }

        public void clearOverlay(string sessionId)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var session = GetMediaSession(sessionId);
            if (session != null)
            {
                session.Overlays.Clear();
                if (session.CurrentScreenPacket != null && "overlay".EqName(session.CurrentScreenPacket.Evaluate<string>("target")))
                {
                    session.CurrentScreenPacket = null;
                }
            }

            var packet = new Dictionary<string, object>
            {
                {"vodType", (int) VodPacketTypeEnum.Stop},
                {"target", "overlay"},
            };

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.VOD, packet);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
            }
        }
        
        public void hideOverlay(string sessionId, string name)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var session = GetMediaSession(sessionId);
            if (session != null && session.Overlays.ContainsKey(name))
            {
                session.Overlays.Remove(name);
                if (session.CurrentScreenPacket != null && "overlay".EqName(session.CurrentScreenPacket.Evaluate<string>("target")) && name.EqName(session.CurrentScreenPacket.Evaluate<string>("name")))
                {
                    session.CurrentScreenPacket = null;
                }
            }

            var item = new Dictionary<string, object> { { "name", name } };
            var items = new List<Dictionary<string, object>> { item };
            var packet = new Dictionary<string, object>
            {
                {"vodType", (int) VodPacketTypeEnum.Stop},
                {"target", "overlay"},
                {"items", items.ToArray()}
            };

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.VOD, packet);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
            }
        }

        public string randomFile(string file)
        {
            if (lengthMap == null || !lengthMap.ContainsKey(file))
            {
                return null;
            }

            var result = lengthMap[file];
            if (result is IDictionary<string, object>)
            {
                var items = (result as IDictionary<string, object>).ToArray();
                if (items.Length < 1)
                {
                    return null;
                }

                return $"{file}/{items[RandomHelper.Random.Next(0, items.Length)].Key}"; 
            }

            return file;
        }

        public void playVOD(string sessionId, object vod)
        {
            if (vod == null)
            {
                return;
            }

            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var items = new List<Dictionary<string, object>>();
            var targetId = hasEmptySession ? "ALL" : sessionId.ToString();
            Logger.LogWithId(vod.SerializeJSON(), $"{scriptedGameContext.Game.Name} > {targetId}");

            if (vod is IEnumerable<object>)
            {
                var collection = vod as IEnumerable<object>;
                foreach (var item in collection)
                {
                    if (item is Dictionary<string, object> && (item as Dictionary<string, object>).ContainsKey("name"))
                    {
                        items.Add(item as Dictionary<string, object>);
                    }
                    else if (item is string)
                    {
                        items.Add(new Dictionary<string, object> { { "name", item.ToString() } });        
                    }
                }
            }
            else
            {
                items.Add(new Dictionary<string, object> {{"name", vodDataValue.ToString()}});
            }

            var vodItems = new List<VODItem>();
            if (lengthMap != null)
            {
                var offset = TimeSpan.Zero;

                foreach (var item in items)
                {
                    var name = item["name"] as string;
                    var vodItem = new VODItem { DateStart = EnvironmentHelper.CurrentTime.Add(offset), Data = item };
                    var info = GetVideoInfo(name);
                    
                    if (info != null)
                    {
                        foreach (var value in info)
                        {
                            switch (value.Key)
                            {
                                case "length":
                                    var length = TimeSpan.FromSeconds(value.Value.ToString().ToInt(0));
                                    offset = offset.Add(length);
                                    vodItem.Length = length;
                                    break;
                            }

                            item[value.Key] = value.Value;
                        }
                    }

                    vodItem.IsLooped = item.Evaluate<bool>("loop");
                    vodItems.Add(vodItem);
                }
            }

            var packet = new Dictionary<string, object>
            {
                {"vodType", (int) VodPacketTypeEnum.Play},
                {"target", "background"},
                {"items", items.ToArray()}
            };


            var session = GetMediaSession(sessionId);
            if (session != null)
            {
                session.CurrentScreenPacket = null;
                session.CurrentVOD = vodItems.Count > 0 ? vodItems.ToArray() : null;
            }

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.VOD, packet);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
            }
        }

        public void showScreen(string sessionId, string type, object parameters)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var data = parameters as IDictionary<string, object> ?? new Dictionary<string, object>();
            var typeValue = type.ToEnum(VodPacketTypeEnum.None);

            var packet = new Dictionary<string, object>
            {
                {"name", typeValue.ToString()},
            };

            if (typeValue != VodPacketTypeEnum.None)
            {
                type = typeValue.ToString();
            }

            IDictionary<string, object> screenData = null;
            if (screenMap != null && screenMap.ContainsKey(type))
            {
                screenData = screenMap[type] as IDictionary<string, object>;
                if (screenData != null)
                {
                    foreach (var item in screenData)
                    {
                        if (!packet.ContainsKey(item.Key))
                        {
                            packet[item.Key] = item.Value;
                        }
                    }
                }
            }

            if (typeValue == VodPacketTypeEnum.None)
            {
                string realType = null;
                if (screenData != null)
                {
                    realType = screenData.ContainsKey("screenType") ? screenData["screenType"] as string : null;
                }

                typeValue = realType.ToEnum(VodPacketTypeEnum.None);

                if (typeValue == VodPacketTypeEnum.None)
                {
                    scriptedGameContext.Game.LogError("Screen '{0}' doesn't have a recognizable type in configuration file: '{1}'".FormatString(type, realType));                    
                }
            }

            var items = new IDictionary<string, object>[] {};
            switch (typeValue)
            {
                case VodPacketTypeEnum.Winners:
                    items = scriptedGameContext.storageHelper.GetLastWinners();
                    break;
            }

            packet["vodType"] = (int) typeValue;
            packet["items"] = items;
            
            if (!packet.ContainsKey("target"))
            {
                packet["target"] = data.ContainsKey("target") && "overlay".EqName(data["target"] as string) ? "overlay" : "background";                
            }

            var session = GetMediaSession(sessionId);
            if (session != null)
            {
                if ("backround".EqName(packet["target"].ToString()))
                {
                    session.CurrentVOD = null;
                }

                session.CurrentScreenPacket = packet;
            }

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.VOD, packet);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.VOD, packet);
            }
        }

        public void sendVirtualCommand(string sessionId, object command)
        {
            var hasEmptySession = String.IsNullOrEmpty(sessionId) || sessionId.EqName("0");
            var commandData = command as IDictionary<string, object>;
            if (commandData == null)
            {
                commandData = new Dictionary<string, object> { {"command", command as string ?? String.Empty}, {"type", virtualType} };
            }
            else
            {
                commandData["type"] = virtualType;
            }

            if (hasEmptySession)
            {
                scriptedGameContext.sendSystemAllInternal(SessionMessageTypeEnum.Virtual, commandData);
            }
            else
            {
                scriptedGameContext.sendSystemInternal(sessionId, SessionMessageTypeEnum.Virtual, commandData);
            }
        }

        public object getClientData(string clientId)
        {
            if (clientData == null)
            {
                return null;
            }

            clientId = (clientId ?? String.Empty).ToLower();
            if (clientData.ContainsKey(clientId))
            {
                return clientData[clientId];
            }

            if (clientData.ContainsKey(String.Empty))
            {
                return clientData[String.Empty];
            }

            return null;
        }

        public void SetStreamConfig(IDictionary<string, object> streamConfig)
        {
            this.streamConfig = streamConfig;
        }
    }
}