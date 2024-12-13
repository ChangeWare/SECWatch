using System.Security.Claims;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.Utils;

public interface ITokenGenerator
{
    UserToken GenerateUserToken(Guid userId);
    
    UserToken GenerateRefreshToken(Guid userId);
    
    VerificationToken GenerateEmailVerificationToken();
    
    
    ClaimsPrincipal? ValidateToken(string token);
}
