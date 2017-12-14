using System.ServiceModel.Channels;

namespace GameCommons.Classes
{
    public class WebServiceFixedTypeMapper : WebContentTypeMapper
    {
        public override WebContentFormat GetMessageFormatForContentType(string contentType)
        {
            if (!string.IsNullOrEmpty(contentType))
            {
                if (contentType.Contains("application/json") || contentType.Contains("application/xml"))
                {
                    return WebContentFormat.Raw;
                }
            }

            return WebContentFormat.Default;
        }
    }
}
