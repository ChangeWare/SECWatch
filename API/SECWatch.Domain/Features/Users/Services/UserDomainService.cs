using FluentResults;

namespace SECWatch.Domain.Features.Users.Services;

public class UserDomainService(IUserRepository userRepository) : IUserDomainService
{
    public async Task<Result<User>> CreateUserAsync(
        string email,
        string passwordHash,
        string firstName,
        string lastName,
        string companyName)
    {
        if (await userRepository.ExistsByEmailAsync(email))
            return Result.Fail<User>("Email already exists");

        var userResult = User.Create(email, passwordHash, firstName, lastName, companyName);
        if (userResult.IsFailed)
            return userResult;

        var user = userResult.Value;
        return Result.Ok(user);
    }

    public async Task<Result<User>> VerifyEmailAsync(
        Guid userId,
        string token)
    {
        var user = await userRepository.GetByIdAsync(userId);
        return user == null ? Result.Fail("User not found") : user.VerifyEmail(token);
    }

    public async Task<Result<User>> ResetPasswordAsync(
        Guid userId,
        string resetToken,
        string newPasswordHash)
    {
        var user = await userRepository.GetByIdAsync(userId);
        return user == null ? Result.Fail("User not found") : user.ResetPassword(resetToken, newPasswordHash);
    }
}