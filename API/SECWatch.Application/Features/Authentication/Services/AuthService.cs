using AutoMapper;
using FluentResults;
using Microsoft.Extensions.Logging;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.Services;

public class AuthService(
    IUserRepository userRepository,
    IPasswordHasher passwordHasher,
    ITokenGenerator jwtTokenGenerator,
    ILogger<AuthService> logger,
    IMapper mapper)
    : IAuthService
{
    private readonly ILogger<AuthService> _logger = logger;

    public async Task<Result<AuthenticationInfo>> LoginAsync(LoginRequest request)
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
        
        var userDto = mapper.Map<UserDto>(user);

        var response = new AuthenticationInfo
        {
            UserId = user.Id.ToString(),
            User = userDto,
            Token = token.Token,
            RefreshToken = refreshToken.Token,
            TokenExpiration = token.Expiry,
            RefreshTokenExpiration = refreshToken.Expiry
        };

        return Result.Ok(response);
    }

    public async Task<Result<AuthenticationInfo>> RefreshTokenAsync(RefreshTokenRequest req)
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
        
        var user = await userRepository.GetByIdAsync(userId);
        
        var userDto = mapper.Map<UserDto>(user);
        
        var response = new AuthenticationInfo
        {
            UserId = userId.ToString(),
            User = userDto,
            Token = newToken.Token,
            RefreshToken = newRefreshToken.Token,
            TokenExpiration = newToken.Expiry,
            RefreshTokenExpiration = newRefreshToken.Expiry
        };

        return Result.Ok(response);
    }
}