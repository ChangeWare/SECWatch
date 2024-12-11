using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.DTOs;

public class AuthenticationResponse
{
    public string UserId { get; init; }
    public string Email { get; init; }
    public UserToken Token { get; init; }
    public UserToken RefreshToken { get; init; }
    public DateTime TokenExpiration { get; init; }
}