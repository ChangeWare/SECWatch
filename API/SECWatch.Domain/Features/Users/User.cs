using FluentResults;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users.Events;

namespace SECWatch.Domain.Features.Users;

public class User : AggregateRoot
{
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string? RefreshToken { get; private set; }
    
    public DateTime? RefreshTokenExpiry { get; private set; }
    
    public DateTime CreatedAt { get; private set; }
    public DateTime? LastLoginAt { get; private set; }
    
    public bool EmailVerified { get; private set; }
    
    public string EmailVerificationToken { get; private set; }
    
    public DateTime? EmailVerificationTokenExpiry { get; private set; }
    
    public DateTime? VerifiedAt { get; private set; }

    private User() { }

    public static Result<User> Create(string email, string passwordHash, string firstName, string lastName)
    {
        var user = new User
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            PasswordHash = passwordHash,
            FirstName = firstName,
            LastName = lastName,
            CreatedAt = DateTime.UtcNow
        };

        user.AddDomainEvent(new UserCreatedDomainEvent(user.Id, user.Email));
        
        if (string.IsNullOrWhiteSpace(email))
            return Result.Fail<User>("Email is required");

        if (string.IsNullOrWhiteSpace(passwordHash))
            return Result.Fail<User>("Password hash is required");

        if (string.IsNullOrWhiteSpace(firstName))
            return Result.Fail<User>("First name is required");

        if (string.IsNullOrWhiteSpace(lastName))
            return Result.Fail<User>("Last name is required");

        return Result.Ok(user);
    }
    
    public Result VerifyEmail(string token)
    {
        if (EmailVerified)
            return Result.Fail("Email already verified");
        
        if (string.IsNullOrWhiteSpace(token))
            return Result.Fail("Verification token is required");
        
        if (EmailVerificationToken != token)
            return Result.Fail("Invalid verification token");
        
        if (EmailVerificationTokenExpiry < DateTime.UtcNow)
            return Result.Fail("Verification token expired");

        EmailVerified = true;
        VerifiedAt = DateTime.UtcNow;
        AddDomainEvent(new UserEmailVerifiedDomainEvent(Id, Email));
        
        return Result.Ok();
    }
    
    public Result ResetPassword(string resetToken, string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(resetToken))
            return Result.Fail("Reset token is required");

        if (string.IsNullOrWhiteSpace(newPasswordHash))
            return Result.Fail("New password hash is required");

        PasswordHash = newPasswordHash;
        AddDomainEvent(new UserPasswordResetDomainEvent(Id, Email));
        
        return Result.Ok();
    }
    
    public void UpdateRefreshToken(UserToken refreshToken)
    {
        RefreshToken = refreshToken.Token;
        RefreshTokenExpiry = refreshToken.Expiry;
        LastLoginAt = DateTime.UtcNow;
    }
    
    public void UpdateEmailVerificationToken(VerificationToken token)
    {
        EmailVerificationToken = token.Token;
        EmailVerificationTokenExpiry = token.Expiry;
    }

    public void ClearRefreshToken()
    {
        RefreshToken = null;
    }
}