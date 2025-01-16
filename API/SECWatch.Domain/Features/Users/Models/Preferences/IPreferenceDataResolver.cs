namespace SECWatch.Domain.Features.Users.Models.Preferences;

public interface IPreferenceDataResolver
{
    T? Resolve<T>(string data);

    string Serialize<T>(T data);
}