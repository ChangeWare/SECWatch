using SECWatch.Application.Features.Authentication.DTOs;

namespace SECWatch.API.Features.Authentication.DTOs;

public record AuthenticationResponse
{
    public required AuthenticationInfo AuthenticationInfo { get; init; }
}