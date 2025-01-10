using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.Services;
using SECWatch.Application.Features.Users.DTOs;

namespace SECWatch.API.Features.Authentication;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{

    [HttpPost("login")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AuthenticationResponse>> Login(LoginRequest req, CancellationToken ct)
    {
        var result = await authService.LoginAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Login",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        var response = new AuthenticationResponse()
        {
            AuthenticationInfo = result.Value
        };

        return Ok(response);
    }
    
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthenticationResponse>> Refresh(RefreshTokenRequest req, CancellationToken ct)
    {
        var result = await authService.RefreshTokenAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Refresh",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        var response = new AuthenticationResponse()
        {
            AuthenticationInfo = result.Value
        };

        return Ok(response);
    }
}