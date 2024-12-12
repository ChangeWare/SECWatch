using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using SECWatch.Application.Features.Authentication.DTOs;
using SECWatch.Application.Features.Authentication.Services;
using SECWatch.Application.Features.Users.DTOs;

namespace SECWatch.API.Features.Authentication.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{

    [HttpPost("login")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login(LoginRequest req, CancellationToken ct)
    {
        var result = await authService.LoginAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Login",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        return Ok(result.Value);
    }
    
    [HttpPost("refresh")]
    public async Task<IActionResult> Refresh(RefreshTokenRequest req, CancellationToken ct)
    {
        var result = await authService.RefreshTokenAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Refresh",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        return Ok(result.Value);
    }
}