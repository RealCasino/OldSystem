using System;
using Noesis.Javascript;

namespace GameCommons.Classes
{
    public class DelayedTask
    {
        private readonly ScriptedGameInstance gameInstance;
        private readonly ScriptedGameContext context;
        private readonly JavascriptContext javascriptContext;
        private readonly string id;
        private readonly object jsFunction;
        private readonly DateTime executionTime;

        public DelayedTask(ScriptedGameInstance gameInstance, ScriptedGameContext context, JavascriptContext javascriptContext, string id, object jsFunction, double period)
        {
            if (double.IsNaN(period))
            {
                throw new InvalidOperationException("Cannot initialize delayed task with NaN delay");
            }

            this.gameInstance = gameInstance;
            this.context = context;
            this.javascriptContext = javascriptContext;
            this.id = id;
            this.jsFunction = jsFunction;
            executionTime = DateTime.Now.Add(TimeSpan.FromMilliseconds(period));
        }

        public string Id => id;

        public bool IsTime => DateTime.Now >= executionTime;

        public void Execute()
        {
            if (!context.IsDisposed)
            {
                try
                {
                    gameInstance.ExecuteCallback(this, jsFunction, false);
                }
                catch (Exception ex)
                {
                    gameInstance.LogError(ex);
                }
            }
        }
    }
}