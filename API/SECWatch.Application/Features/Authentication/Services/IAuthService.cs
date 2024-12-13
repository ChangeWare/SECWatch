using FluentResults;
using SECWatch.Application.Features.Authentication.DTOs;

namespace SECWatch.Application.Features.Authentication.Services;

public interface IAuthService
{
    Task<Result<AuthenticationResponse>> LoginAsync(LoginRequest request);
    Result<AuthenticationResponse> RefreshToken(RefreshTokenRequest request);
}