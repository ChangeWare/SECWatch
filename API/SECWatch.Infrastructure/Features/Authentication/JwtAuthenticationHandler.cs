using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace SECWatch.Infrastructure.Features.Authentication;

public class JwtAuthenticationHandler : JwtBearerHandler
{
    public JwtAuthenticationHandler(
        IOptionsMonitor<JwtBearerOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) 
        : base(options, logger, encoder)
    {
        Console.WriteLine("JwtAuthenticationHandler constructed!"); // Debug line
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        Console.WriteLine("HandleAuthenticateAsync called!"); // Debug line
        var result = await base.HandleAuthenticateAsync();
            
        if (!result.Succeeded)
        {
            Console.WriteLine($"Auth failed: {result.Failure?.Message}"); // Debug line
            return result;
        }
        
        return result;
    }
}