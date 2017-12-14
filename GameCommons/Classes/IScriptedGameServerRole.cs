namespace GameCommons.Classes
{
    public interface IScriptedGameServerRole
    {
        void SessionKeepAlive(SessionWrapper sessionWrapper);
        void LeaveInternal(SessionWrapper sessionWrapper, string gameId);
    }
}