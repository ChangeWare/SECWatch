using Newtonsoft.Json;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.Infrastructure.Features.Users;

public class PreferenceDataResolver : IPreferenceDataResolver
{
    public T? Resolve<T>(string data)
    {
        return JsonConvert.DeserializeObject<T>(data);
    }

    public string Serialize<T>(T data)
    {
        return JsonConvert.SerializeObject(data);
    }
}