using FluentResults;
using Microsoft.Extensions.Logging;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.Services;

public class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenGenerator jwtTokenGenerator,
    ILogger<AuthService> logger)
    : IAuthService
{
    private readonly ILogger<AuthService> _logger = logger;

    public async Task<Result<AuthenticationResponse>> LoginAsync(LoginRequest request)
    {
        var user = await userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return Result.Fail(new Error("No user found with that email"));
        }
        
        var pwdCheckResult = passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!pwdCheckResult)
        {
            return Result.Fail(new Error("Invalid credentials"));
        }

        // Generate tokens
        var token = jwtTokenGenerator.GenerateUserToken(user.Id);
        var refreshToken = jwtTokenGenerator.GenerateRefreshToken(user.Id);
        
        user.UpdateLastLogin();

        var response = new AuthenticationResponse
        {
            UserId = user.Id.ToString(),
            Token = token,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(1)
        };

        return Result.Ok(response);
    }

    public Result<AuthenticationResponse> RefreshToken(RefreshTokenRequest req)
    {
        var principal = jwtTokenGenerator.ValidateToken(req.RefreshToken);
        if (principal == null)
        {
            return Result.Fail(new Error("Invalid refresh token"));
        }

        var userId = principal.GetUserId();
        
        if (principal.GetUserId() != userId)
        {
            return Result.Fail(new Error("Invalid user id on refresh token"));
        }
        
        var newToken = jwtTokenGenerator.GenerateUserToken(userId);
        var newRefreshToken = jwtTokenGenerator.GenerateRefreshToken(userId);
        
        var response = new AuthenticationResponse
        {
            UserId = userId.ToString(),
            Token = newToken,
            RefreshToken = newRefreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(1)
        };

        return Result.Ok(response);
    }
}