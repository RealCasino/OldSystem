using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading;
using Commons.Exceptions;
using Commons.Helpers;
using Commons.Log;
using Commons.Monitoring;
using Commons.Network.WCF;
using Noesis.Javascript;
using WebCommons.Classes.Games;
using WebCommons.Services;

namespace GameCommons.Classes
{
    public class ScriptedGameWrapper : IDisposable
    {
        public event EventHandler<ScriptedGameWrapperEventArgs> OnRegisterInstance;
        public event EventHandler<ScriptedGameWrapperEventArgs> OnUnRegisterInstance;
        private readonly List<ScriptedGameInstance> gameInstances = new List<ScriptedGameInstance>();
        private readonly object instanceLock = new object();
        private readonly string entryFile;
        private readonly string entryFolder;
        private readonly string rootFolder;
        private readonly string folderName;
        private readonly Uri exchangeClientUri;
        private readonly SimpleWCFClient<ITelnetClientService> playerClientFactory;
        private readonly IAccountingFacadeFactory accountingFacadeFactory;
        private readonly ILiveReportTracker reportTracker;
        private readonly IDictionary<string, object> settings;
        private readonly string externalGameUrl;
        private readonly string externalGameSSLUrl;
        private readonly string id;
        private GameTypeData gameTypeEntity;
        private int instanceCount;
        private bool isDisposed;
        
        public ScriptedGameWrapper(string entryFile, Uri exchangeClientUri, SimpleWCFClient<ITelnetClientService> playerClientFactory, string externalGameUrl, string externalGameSSLUrl, double externalDelay, IDictionary<string, object> settings, IAccountingFacadeFactory accountingFacadeFactory, ILiveReportTracker reportTracker)
        {
            ExternalDelay = externalDelay;
            this.settings = settings;
            this.accountingFacadeFactory = accountingFacadeFactory;
            this.reportTracker = reportTracker;
            this.entryFile = entryFile;
            this.exchangeClientUri = exchangeClientUri;
            this.playerClientFactory = playerClientFactory;
            this.externalGameUrl = externalGameUrl;
            this.externalGameSSLUrl = externalGameSSLUrl;
            entryFolder = Path.GetDirectoryName(entryFile);
            rootFolder = entryFolder.CombinePath("..").ToFullPath();
            folderName = Path.GetFileName(Path.GetDirectoryName(entryFolder));
            id = folderName.Trim().ToLower();
        }

        public string Id => id;

        public string EntryFile => entryFile;

        public string EntryFolder => entryFolder;

        public string RootFolder => rootFolder;

        public GameTypeData GameTypeEntity => gameTypeEntity;

        public Uri ExchangeClientUri => exchangeClientUri;

        public SimpleWCFClient<ITelnetClientService> PlayerClientFactory => playerClientFactory;

        public double ExternalDelay { get; private set; }

        public bool Initialize(IScriptedGameServerRole parent)
        {
            MonitoringFacade.RegisterMonitoringSource(id);
            var entryScript = entryFile.ReadAllTextFromFile();

            try
            {
                using (var context = JavascriptContextFactory.Create())
                {
                    context.Run(entryScript, Path.GetFileName(entryFile));
                }
            }
            catch (JavascriptException ex)
            {
                LogScriptError(entryFile, folderName, ex);
                return false;
            }

            if (string.IsNullOrEmpty(id))
            {
                throw new BusinessException("Game type cannot be empty (entry file '{0}').".FormatString(entryFile));
            }

            gameTypeEntity = ExternalServiceFacade.GetGameCoreService().GetGameType(id);

            return true;
        }
        
        public void InitializeInstances()
        {
            if (isDisposed)
            {
                return;
            }

            Log(Id, "Initializing game instances...");

            var games = ExternalServiceFacade.GetGameCoreService().GetGames(gameTypeEntity.Id);

            foreach (var game in games)
            {
                var instance = new ScriptedGameInstance(this, game, externalGameUrl, externalGameSSLUrl, GetInstanceSettings(game), accountingFacadeFactory.CreateFacade(), reportTracker);
                instance.Start();
            }
        }

        private IDictionary<string, object> GetInstanceSettings(GameData game)
        {
            return settings;
        }

        public void StartInstance(GameData gameData, bool waitForEnd)
        {
            var instance = new ScriptedGameInstance(this, gameData, externalGameUrl, externalGameSSLUrl, GetInstanceSettings(gameData), accountingFacadeFactory.CreateFacade(), reportTracker);
            instance.Start();
            if (waitForEnd)
            {
                instance.WaitReady();
            }
        }

        public void NotifyIstanceAdded(ScriptedGameInstance gameInstance)
        {
            lock (instanceLock)
            {
                instanceCount++;
                gameInstances.Add(gameInstance);
            }

            MonitoringFacade.RegisterMonitoringSource(gameInstance.Name);

            if (OnRegisterInstance != null)
            {
                OnRegisterInstance(gameInstance, new ScriptedGameWrapperEventArgs(gameInstance.Id));
            }
        }

        public void NotifyIstanceRenamed(string oldName, ScriptedGameInstance gameInstance)
        {
            MonitoringFacade.UnregisterMonitoringSource(oldName);
            MonitoringFacade.RegisterMonitoringSource(gameInstance.Name);

            if (OnUnRegisterInstance != null)
            {
                OnUnRegisterInstance(gameInstance, new ScriptedGameWrapperEventArgs(oldName));
            }

            if (OnRegisterInstance != null)
            {
                OnRegisterInstance(gameInstance, new ScriptedGameWrapperEventArgs(gameInstance.Id));
            }
        }
        
        public void LogScriptMessage(string file, string instanceId, string message)
        {
            Logger.LogWithId(message, instanceId);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.Message, message);
        }

        public void LogScriptResponse(string file, string instanceId, string message)
        {
            Logger.LogWithId(message, instanceId);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.ScriptResponse, message);
        }

        public void LogScriptError(string file, string instanceId, JavascriptException ex, string subSource = null)
        {
            var additionalData = new StringBuilder();
            if (ex.Data.Contains("V8SourceLine"))
            {
                additionalData.Append("Source line: ");
                additionalData.AppendLine(ex.Data["V8SourceLine"] as string);
            }

            if (ex.Data.Contains("V8StackTrace"))
            {
                additionalData.Append("Stack trace: ");
                additionalData.AppendLine(ex.Data["V8StackTrace"] as string);
            }

            if (!String.IsNullOrEmpty(ex.Source))
            {
                subSource = String.IsNullOrEmpty(subSource) ? ex.Source : "{0}/{1}".FormatString(subSource, ex.Source);
            }

            if (additionalData.Length > 0)
            {
                additionalData = additionalData.Insert(0, Environment.NewLine);
            }

            var message = "JS Error '{0}' at {1}line {2}, columns {3}:{4}.{5}".FormatString(ex.Message, String.IsNullOrEmpty(subSource) ? String.Empty : "{0}, ".FormatString(subSource), ex.Line, ex.StartColumn, ex.EndColumn, additionalData.ToString());
            Logger.LogError(message, instanceId);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.Error, message);
        }

        public void Log(string instanceId, string message, params object[] param)
        {
            Logger.LogWithId(message, instanceId, param);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.Message, message.FormatString(param));
        }

        public void LogError(string instanceId, Exception ex)
        {
            Logger.Log(ex, instanceId);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.Error, ex.Message);            
        }

        public void LogError(string instanceId, string message)
        {
            Logger.LogError(message, instanceId);
            MonitoringFacade.AddLog(instanceId, LogMessageTypeEnum.Error, message);
        }

        public void NotifyIstanceRemoved(ScriptedGameInstance gameInstance)
        {
            lock (instanceLock)
            {
                instanceCount--;
                if (gameInstances.Contains(gameInstance))
                {
                    gameInstances.Remove(gameInstance);
                }
            }

            try
            {
                if (OnUnRegisterInstance != null)
                {
                    OnUnRegisterInstance(gameInstance, new ScriptedGameWrapperEventArgs(gameInstance.Id));
                }
            }
            catch (Exception ex)
            {
                Logger.Log(ex);
            }
        }
        
        public void ProcessChangedFile(string changedFile)
        {
            var directory = Path.GetDirectoryName(changedFile);
            if (!directory.StartsWith(entryFolder, StringComparison.InvariantCultureIgnoreCase))
            {
                return;
            }

            Log(Id, "Restarting game type '{0}' due to {1} change.", id, Path.GetFileName(changedFile));
            var instancesToStop = gameInstances.ToArray();
            foreach (var gameInstance in instancesToStop)
            {
                gameInstance.Dispose(true);
            }

            var counter = 30000;
            while (instanceCount > 0 && counter > 0)
            {
                counter -= 50;
                Thread.Sleep(50);
            }

            gameInstances.Clear();

            InitializeInstances();
        }

        public InternalGameInfo GetGameTypeInfo()
        {
            string[] clientIds = null;

            try
            {
                clientIds = Directory.GetDirectories(String.Concat(RootFolder, "/clients/")).Select(Path.GetFileName).ToArray();
            }
            catch { }


            return new InternalGameInfo { ClientIds = clientIds };
        }

        public string GetClientConfig()
        {
            var fileName = rootFolder.CombinePath("config.json");
            if (!File.Exists(fileName))
            {
                return null;
            }

            return File.ReadAllText(fileName);
        }
        
        public string GetLocalization(string gameId)
        {
            var fileName = "Localization.{0}.json".FormatString(gameId);
            if (!File.Exists(rootFolder.CombinePath(fileName)) || gameId.EqName(id))
            {
                fileName = "Localization.json";
            }

            return File.ReadAllText(rootFolder.CombinePath(fileName));
        }

        public void RenameLocalization(string oldName, string newName)
        {
            var fileName = rootFolder.CombinePath("Localization.{0}.json".FormatString(oldName));
            var newFileName = rootFolder.CombinePath("Localization.{0}.json".FormatString(newName));
            if (File.Exists(fileName))
            {
                FileHelper.MoveFile(fileName, newFileName);
            }
        }
        
        public void SaveLocalization(string gameId, string data)
        {
            var fileName = String.IsNullOrEmpty(gameId) || gameId.EqName(id) ? "Localization.json" : "Localization.{0}.json".FormatString(gameId);
            File.WriteAllText(rootFolder.CombinePath(fileName), data);
        }

        public void Dispose()
        {
            isDisposed = true;
            try
            {
                Log(Id, "Shutting down game type '{0}'.", id);
                foreach (var scriptedGameInstance in gameInstances.ToArray())
                {
                    scriptedGameInstance.Dispose();
                }

                var counter = 30000;
                while (instanceCount > 0 && counter > 0)
                {
                    counter -= 50;
                    Thread.Sleep(50);
                }
            }
            catch (Exception ex)
            {
                Logger.Log(ex);
            }
            finally
            {
                MonitoringFacade.UnregisterMonitoringSource(folderName);
            }
        }
    }
}