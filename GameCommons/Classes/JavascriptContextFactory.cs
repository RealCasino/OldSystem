using System.Runtime.InteropServices;
using Noesis.Javascript;

namespace GameCommons.Classes
{
    public static class JavascriptContextFactory
    {
        [DllImport("kernel32.dll")]
        static extern bool SetThreadLocale(uint Locale);


        private static readonly object factoryLocker = new object();

        public static JavascriptContext Create()
        {
            lock (factoryLocker)
            {
                SetThreadLocale(1033);
                return new JavascriptContext();
            }
        }
    }
}