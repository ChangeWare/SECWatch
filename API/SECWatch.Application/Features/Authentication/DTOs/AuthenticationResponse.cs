using SECWatch.Application.Features.Users.DTOs;

namespace SECWatch.Application.Features.Authentication.DTOs;

public record AuthenticationInfo
{
    public required UserDto User { get; set; }
    
    public required string UserId { get; init; }
    public required string Token { get; init; }
    public required string RefreshToken { get; init; }
    public required DateTime TokenExpiration { get; init; }
    
    public required DateTime RefreshTokenExpiration { get; init; }
}