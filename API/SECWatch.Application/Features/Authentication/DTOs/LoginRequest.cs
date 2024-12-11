namespace SECWatch.Application.Features.Authentication.DTOs;

public class LoginRequest
{
    public string Email { get; init; }
    public string Password { get; init; }
}