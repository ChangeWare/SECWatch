using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.DTOs;

public record AuthenticationResponse
{
    public required string UserId { get; init; }
    public required UserToken Token { get; init; }
    public required UserToken RefreshToken { get; init; }
    public required DateTime TokenExpiration { get; init; }
}