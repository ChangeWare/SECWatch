using Microsoft.AspNetCore.Mvc;
using SECWatch.Application.Features.Users.DTOs;
using SECWatch.Application.Features.Users.Services;

namespace SECWatch.API.Features.Users.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(
    IUserService userService,
    ILogger<UsersController> logger)
    : ControllerBase
{
    private readonly ILogger<UsersController> _logger = logger;

    [HttpPost]
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

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await userService.GetByIdAsync(id.ToString());

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