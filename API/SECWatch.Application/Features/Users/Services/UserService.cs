using FluentResults;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Application.Features.Communication.Services;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Domain.Features.Authentication.Services;
using SECWatch.Domain.Features.Users;
using SECWatch.Domain.Features.Users.Services;

namespace SECWatch.Application.Features.Users.Services;

public class UserService(
    IUserDomainService userDomainService, 
    IEmailService emailService,
    ITokenGenerator tokenService,
    IPasswordHasher passwordHasher,
    IUserRepository userRepository
    ) : IUserService
{
    
    public async Task<Result<UserResponse>> RegisterAsync(RegisterUserRequest req)
    {   
        var passwordHash = passwordHasher.HashPassword(req.Password);
        
        var userResult = await userDomainService.CreateUserAsync(
            req.Email,
            passwordHash,
            req.FirstName,
            req.LastName);
        
        if (userResult.IsFailed)
        {
            return Result.Fail(userResult.Errors);
        }

        var user = userResult.Value;
        
        // Generate verification token and send email
        var verificationToken = tokenService.GenerateEmailVerificationToken();
        
        // Store the token in the user entity
        user.UpdateEmailVerificationToken(verificationToken);
        
        await emailService.SendVerificationEmailAsync(user.Email, verificationToken);
        
        await userRepository.AddAsync(user);
        await userRepository.SaveChangesAsync();
        
        return Result.Ok(new UserResponse(user));
    }

    public async Task<Result<UserResponse>> GetByIdAsync(string id)
    {
        var user = await userRepository.GetByIdAsync(id);
        
        if (user == null)
            return Result.Fail($"User with id {id} not found");
        
        return Result.Ok(new UserResponse(user));
    }

    public async Task<Result> VerifyEmailAsync(VerifyEmailRequest req)
    {
        return await userDomainService.VerifyEmailAsync(
            req.UserId,
            req.Token);
    }
}