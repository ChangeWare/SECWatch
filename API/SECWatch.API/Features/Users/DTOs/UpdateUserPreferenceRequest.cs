using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.API.Features.Users.DTOs;

public record UpdateUserPreferenceRequest
{
    public required Dictionary<string, object> Preference { get; init; }
}