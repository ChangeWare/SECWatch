using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using SECWatch.Application.Features.Authentication.Utils;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Infrastructure.Features.Authentication.Utils;

public class JwtTokenConfiguration
{
    public string Secret { get; init; } = string.Empty;
    public int EmailVerificationTokenExpiryHours { get; init; }
    public int PasswordResetTokenExpiryHours { get; init; } 
    
    public string Issuer { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
    
    public int UserTokenExpiryHours { get; init; } 
}

public class JwtTokenGenerator(JwtTokenConfiguration config) : ITokenGenerator
{
    public VerificationToken GenerateEmailVerificationToken()
    {
        var expiry = DateTime.UtcNow.AddHours(config.EmailVerificationTokenExpiryHours);
      
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(config.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Claims = new Dictionary<string, object>
            {
                { "purpose", "email_verification" },
                { JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString() }
            },
            Expires = expiry,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        
        return new VerificationToken(tokenHandler.WriteToken(securityToken), expiry);
    }

    public VerificationToken GeneratePasswordResetToken(Guid userId)
    {
        var expiry = DateTime.UtcNow.AddHours(config.EmailVerificationTokenExpiryHours);
      
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(config.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([new Claim(ClaimTypes.NameIdentifier, userId.ToString())]),
            Claims = new Dictionary<string, object>
            {
                { "purpose", "password_verification" },
                { JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString() }
            },
            Expires = expiry,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        
        return new VerificationToken(tokenHandler.WriteToken(securityToken), expiry);
    }

    public UserToken GenerateUserToken(Guid userId)
    {
        var expiry = DateTime.UtcNow.AddHours(config.UserTokenExpiryHours);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(config.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Claims = new Dictionary<string, object>
            {
                { "purpose", "user_token" },
                { JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString() },
                { ClaimTypes.NameIdentifier, userId.ToString() }
            },
            Issuer = config.Issuer,      // From config
            Audience = config.Audience,   // From config
            Expires = expiry,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        
        return new UserToken(tokenHandler.WriteToken(securityToken), expiry);
    }

    public UserToken GenerateRefreshToken(Guid userId)
    {
        var expiry = DateTime.UtcNow.AddHours(config.UserTokenExpiryHours);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(config.Secret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Claims = new Dictionary<string, object>
            {
                { "purpose", "refresh_token" },
                { JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString() }
            },
            Issuer = config.Issuer,      // From config
            Audience = config.Audience,   // From config
            Expires = expiry,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var securityToken = tokenHandler.CreateToken(tokenDescriptor);
        
        return new UserToken(tokenHandler.WriteToken(securityToken), expiry);
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(config.Secret);
        
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true
        };
        
        try
        {
            var principal = tokenHandler.ValidateToken(
                token, 
                validationParameters,
                out var securityToken);
            
            return principal;
        }
        catch
        {
            return null;
        }
    }
}