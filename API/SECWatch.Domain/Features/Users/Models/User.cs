using System.Text.Json;
using FluentResults;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.Domain.Features.Users.Models;

public class User : AggregateRoot
{
    public required string Email { get; init; }
    public string PasswordHash { get; private set; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    
    public string? CompanyName { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    public DateTime? LastLoginAt { get; private set; }
    
    public bool EmailVerified { get; private set; }
    
    public DateTime? VerifiedAt { get; private set; }
    
    private string? EmailVerificationToken { get;  set; }
    
    public DateTime? EmailVerificationTokenExpiry { get; private set; }

    private Dictionary<string, UserPreference> _preferences = new();
    
    public static Result<User> Create(
        string email, 
        string passwordHash, 
        string firstName, 
        string lastName,
        string? companyName)
    {
        var user = new User
        {
            Email = email,
            PasswordHash = passwordHash,
            FirstName = firstName,
            LastName = lastName,
            CreatedAt = DateTime.UtcNow,
            CompanyName = companyName
        };

        user.SetupUserPreferences();
        
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
    
    public Result<User> VerifyEmail(string token)
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
        
        return Result.Ok(this);
    }
    
    public Result<User> ResetPassword(string resetToken, string newPasswordHash)
    {
        if (string.IsNullOrWhiteSpace(resetToken))
            return Result.Fail("Reset token is required");

        if (string.IsNullOrWhiteSpace(newPasswordHash))
            return Result.Fail("New password hash is required");

        PasswordHash = newPasswordHash;
        
        return Result.Ok(this);
    }
    
    public void UpdateLastLogin()
    {
        LastLoginAt = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Runs business logic against the user. If there are any updates, return true.
    /// </summary>
    /// <returns>Signifies whether business logic resulted in updates to the user.</returns>
    public Result RunLoginBusinessLogic()
    {
        // If the user is missing any preferences, create them.
        if (!_preferences.ContainsKey(PreferenceKeys.RecentFilingsWidget))
        {
            this.SetPreference(PreferenceKeys.RecentFilingsWidget, RecentFilingsWidgetPreferences.Default);
        }
        
        this.UpdateLastLogin();
        
        return Result.Ok();
    }
    
    private void SetupUserPreferences()
    {
        _preferences = new Dictionary<string, UserPreference>
        {
            { PreferenceKeys.RecentFilingsWidget, RecentFilingsWidgetPreferences.Default }
        };
    }
    
    public void UpdateEmailVerificationToken(VerificationToken token)
    {
        EmailVerificationToken = token.Token;
        EmailVerificationTokenExpiry = token.Expiry;
    }
    
    public void SetPreference(string key, UserPreference preference)
    {
        _preferences[key] = preference;
    }
    
    public UserPreference GetPreference(string key)
    {
        return _preferences[key];
    }
    
}