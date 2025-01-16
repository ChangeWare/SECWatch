namespace SECWatch.Domain.Features.Users.Models.Preferences;

public class UserPreference
{
    public Dictionary<string, object> Values { get; set; } = new();
    
    private UserPreference() { }

    public UserPreference(Dictionary<string, object> values)
    {
        this.Values = values;
    }
}