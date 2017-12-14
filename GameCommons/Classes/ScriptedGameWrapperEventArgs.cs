using System;

namespace GameCommons.Classes
{
    public class ScriptedGameWrapperEventArgs : EventArgs
    {
        public ScriptedGameWrapperEventArgs(string instanceId)
        {
            InstanceId = instanceId;
        }

        public string InstanceId { get; private set; }
    }
}