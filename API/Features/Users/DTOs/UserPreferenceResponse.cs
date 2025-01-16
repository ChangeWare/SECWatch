using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.API.Features.Users.DTOs;

public record UserPreferenceResponse
{
    public required Dictionary<string, object> Preference { get; init; }
}