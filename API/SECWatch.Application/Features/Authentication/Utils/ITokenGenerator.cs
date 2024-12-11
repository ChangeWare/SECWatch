using System.Security.Claims;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users;

namespace SECWatch.Application.Features.Authentication.Utils;

public interface ITokenGenerator
{
    UserToken GenerateUserToken();
    
    VerificationToken GenerateEmailVerificationToken();
    
    UserToken GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
}
