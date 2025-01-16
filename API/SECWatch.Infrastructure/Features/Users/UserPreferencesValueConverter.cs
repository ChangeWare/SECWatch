using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.Infrastructure.Features.Users;

public class UserPreferencesValueConverter()
    : ValueConverter<Dictionary<string, UserPreference>, string>(preferences => SerializePreferences(preferences),
        dbData => DeserializePreferences(dbData))
{
    // Convert dictionary to JSON string
    // Convert JSON string back to dictionary

    private static string SerializePreferences(Dictionary<string, UserPreference> preferences)
    {
        var serializablePreferences = preferences.ToDictionary(
            kvp => kvp.Key,
            kvp => kvp.Value.Values
        );
        return JsonSerializer.Serialize(serializablePreferences);
    }

    private static Dictionary<string, UserPreference> DeserializePreferences(string dbData)
    {
        if (string.IsNullOrEmpty(dbData))
            return new Dictionary<string, UserPreference>();

        var rawPreferences = JsonSerializer.Deserialize<Dictionary<string, Dictionary<string, object>>>(dbData);
        return rawPreferences?.ToDictionary(
            kvp => kvp.Key,
            kvp => new UserPreference(kvp.Value)
        ) ?? new Dictionary<string, UserPreference>();
    }
}