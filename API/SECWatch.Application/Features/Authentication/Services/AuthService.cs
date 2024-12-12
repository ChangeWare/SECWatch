using FluentResults;
using Microsoft.Extensions.Logging;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenGenerator _jwtTokenGenerator;
    private readonly ILogger<AuthService> _logger;
    
    public AuthService(
        IUserRepository userRepository,
        IPasswordHasher passwordHasher,
        ITokenGenerator jwtTokenGenerator,
        ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenGenerator = jwtTokenGenerator;
        _logger = logger;
    }

    public async Task<Result<AuthenticationResponse>> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null)
        {
            return Result.Fail(new Error("Invalid credentials"));
        }
        
        var pwdCheckResult = _passwordHasher.VerifyPassword(request.Password, user.PasswordHash);
        if (!pwdCheckResult)
        {
            return Result.Fail(new Error("Invalid credentials"));
        }

        // Generate tokens
        var token = _jwtTokenGenerator.GenerateUserToken();
        var refreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        // Update user's refresh token
        user.UpdateRefreshToken(refreshToken);
        await _userRepository.UpdateAsync(user);

        var response = new AuthenticationResponse
        {
            UserId = user.Id.ToString(),
            Email = user.Email,
            Token = token,
            RefreshToken = refreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(1)
        };

        return Result.Ok(response);
    }

    public async Task<Result<AuthenticationResponse>> RefreshTokenAsync(RefreshTokenRequest req)
    {
        var principal = _jwtTokenGenerator.ValidateToken(req.Token);
        if (principal == null)
        {
            return Result.Fail(new Error("Invalid token"));
        }

        var userId = principal.GetUserId();
        
        var user = await _userRepository.GetByIdAsync(userId);
        
        if (user == null || user.RefreshToken != req.RefreshToken)
        {
            return Result.Fail(new Error("Invalid refresh token"));
        }

        var newToken = _jwtTokenGenerator.GenerateUserToken();
        var newRefreshToken = _jwtTokenGenerator.GenerateRefreshToken();

        user.UpdateRefreshToken(newRefreshToken);
        await _userRepository.UpdateAsync(user);

        var response = new AuthenticationResponse
        {
            UserId = user.Id.ToString(),
            Email = user.Email,
            Token = newToken,
            RefreshToken = newRefreshToken,
            TokenExpiration = DateTime.UtcNow.AddHours(1)
        };

        return Result.Ok(response);

    }

    public async Task<Result> LogoutAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
        {
            return Result.Fail(new Error("User not found"));
        }

        user.ClearRefreshToken();
        await _userRepository.UpdateAsync(user);

        return Result.Ok();
    }
}