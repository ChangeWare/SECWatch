using FluentResults;

namespace SECWatch.Domain.Features.Users.Services;

public interface IUserDomainService
{
    Task<Result<User>> CreateUserAsync(
        string email, 
        string passwordHash, 
        string firstName, 
        string lastName
    );
    
    Task<Result> VerifyEmailAsync(
        string userId, 
        string token
    );
    
    Task<Result> ResetPasswordAsync(
        string userId,
        string resetToken,
        string newPasswordHash
    );
}