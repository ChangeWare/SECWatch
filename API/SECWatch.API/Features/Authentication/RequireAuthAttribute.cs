using Microsoft.AspNetCore.Authorization;

namespace SECWatch.API.Features.Authentication;

public class RequireAuthAttribute : AuthorizeAttribute
{
    public RequireAuthAttribute()
    {
        AuthenticationSchemes = "Bearer";
    }
}