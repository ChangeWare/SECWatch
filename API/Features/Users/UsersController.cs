using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Users.DTOs;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Application.Features.Users.Services;
using SECWatch.Domain.Features.Users.Models.Preferences;

namespace SECWatch.API.Features.Users;

[ApiController]
[Route("api/[controller]")]
public class UsersController(
    IUserService userService,
    ILogger<UsersController> logger,
    IPreferenceDataResolver preferenceDataResolver)
    : ControllerBase
{
    private readonly ILogger<UsersController> _logger = logger;

    [HttpPost("register")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register(
        [FromBody] RegisterUserRequest req,
        CancellationToken ct)
    {
        var result = await userService.RegisterAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Registration",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value.User.Id },
            result.Value);
    }
    
    [HttpPost("preferences/{key}/update")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdatePreference(
        string key,
        [FromBody] UpdateUserPreferenceRequest req,
        CancellationToken ct)
    {
        var userId = User.GetUserId();
        var userPreference = new UserPreference(req.Preference);
        
        var result = await userService.UpdateUserPreferenceAsync(userId, key, userPreference);

        if (result.IsFailed)
            return NotFound();

        return Ok();
    }
    
    [HttpGet("preferences/{key}")]
    [ProducesResponseType(typeof(UserPreferenceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPreference(
        string key,
        CancellationToken ct)
    {
        var userId = User.GetUserId();
        
        var result = await userService.GetUserPreferenceAsync(userId, key);

        if (result.IsFailed)
            return NotFound();
        
        var preference = result.Value;

        var response = new UserPreferenceResponse()
        {
            Preference = preference.Values
        };

        return Ok(response);
    }
    
    

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await userService.GetByIdAsync(id);

        if (result.IsFailed)
            return NotFound();

        return Ok(result.Value);
    }

    [HttpPost("verify-email")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> VerifyEmail(
        [FromBody] VerifyEmailRequest req,
        CancellationToken ct)
    {
        var result = await userService.VerifyEmailAsync(req);

        if (result.IsFailed)
            return BadRequest(new ValidationProblemDetails(
                new Dictionary<string, string[]>
                {
                    { "Verification",  result.Errors.Select(e => e.Message).ToArray() }
                }));

        return Ok();
    }
}