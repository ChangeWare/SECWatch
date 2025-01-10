using FluentResults;
using SECWatch.Application.Features.Authentication.DTOs;

namespace SECWatch.Application.Features.Authentication.Services;

public interface IAuthService
{
    Task<Result<AuthenticationInfo>> LoginAsync(LoginRequest request);
    Task<Result<AuthenticationInfo>> RefreshTokenAsync(RefreshTokenRequest request);
}