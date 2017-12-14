using System.ServiceModel;
using Commons.DTO;

namespace GameCommons.Classes
{
    [ServiceContract]
    public interface IGamesPullCallback
    {
        [OperationContract(IsOneWay = true)]
        void SendMessage(SessionMessage message);
    }
}
