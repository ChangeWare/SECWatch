using FluentResults;

namespace SECWatch.Domain.Features.Users.Services;

public interface IUserDomainService
{
    Task<Result<User>> CreateUserAsync(
        string email, 
        string passwordHash, 
        string firstName, 
        string lastName,
        string companyName
    );
    
    Task<Result<User>> VerifyEmailAsync(
        Guid userId, 
        string token
    );
    
    Task<Result<User>> ResetPasswordAsync(
        Guid userId,
        string resetToken,
        string newPasswordHash
    );
}