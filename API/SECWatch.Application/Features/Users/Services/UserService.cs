using System.Text.Json;
using System.Text.Json.Serialization;
using FluentResults;
using SECWatch.Application.Common.Events;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Domain.Features.Users;
using SECWatch.Domain.Features.Users.Models.Preferences;
using SECWatch.Domain.Features.Users.Services;

namespace SECWatch.Application.Features.Users.Services;

public class UserService(
    IUserDomainService userDomainService, 
    IEmailService emailService,
    ITokenGenerator tokenService,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository,
    ISystemEventService eventService,
    IPreferenceDataResolver preferenceDataResolver
    ) : IUserService
{
    
    public async Task<Result<UserResponse>> RegisterAsync(RegisterUserRequest req)
    {   
        var passwordHash = passwordHasher.HashPassword(req.Password);
        
        var userResult = await userDomainService.CreateUserAsync(
            req.Email,
            passwordHash,
            req.FirstName,
            req.LastName,
            req.CompanyName);
        
        if (userResult.IsFailed)
        {
            return Result.Fail(userResult.Errors);
        }

        var user = userResult.Value;
        
        // Generate verification token and send email
        var verificationToken = tokenService.GenerateEmailVerificationToken();
        
        // Store the token in the user entity
        user.UpdateEmailVerificationToken(verificationToken);
        
        await userRepository.AddAsync(user);
        
        await emailService.SendVerificationEmailAsync(user.Email, verificationToken);
        
        await eventService.TrackEventAsync(
            "UserRegistered",
            "User",
            user.Id,
            user.Id,
            new Dictionary<string, string>
            {
                { "email", user.Email }
            }
        );
        
        return Result.Ok(new UserResponse(user));
    }

    public async Task<Result<UserResponse>> GetByIdAsync(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        
        if (user == null)
            return Result.Fail($"User with id {id} not found");
        
        return Result.Ok(new UserResponse(user));
    }

    public async Task<Result> VerifyEmailAsync(VerifyEmailRequest req)
    {
        var result = await userDomainService.VerifyEmailAsync(
            req.UserId,
            req.Token);
        
        await eventService.TrackEventAsync(
            "EmailVerified",
            "User",
            req.UserId,
            req.UserId,
            new Dictionary<string, string>
            {
                { "email", result.Value.Email },
                { "verifiedAt", result.Value.VerifiedAt.ToString() },
                { "success", result.IsSuccess.ToString() },
                { "errors", string.Join(", ", result.Errors) }
            }
        );

        return result.ToResult();
    }

    public async Task<Result> UpdateUserPreferenceAsync(Guid id, string key, UserPreference preference)
    {
        var user = await userRepository.GetByIdAsync(id);
        
        if (user == null)
            return Result.Fail($"User with id {id} not found");
        
        

        user.SetPreference(key, preference);
        await userRepository.UpdateAsync(user);
        
        return Result.Ok();
    }

    public async Task<Result<UserPreference>> GetUserPreferenceAsync(Guid id, string key)
    {
        var user = await userRepository.GetByIdAsync(id);
    
        if (user == null)
            return Result.Fail($"User with id {id} not found");

        var preference = user.GetPreference(key);
        
        if (preference == null)
            return Result.Fail($"Preference with key {key} not found");
        

        return Result.Ok(preference);
    }
}