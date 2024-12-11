namespace SECWatch.Application.Features.Authentication.DTOs;

public class RegisterRequest
{
    public required string FirstName { get; init; }
    
    public required string LastName { get; init; }
    
    public string? CompanyName { get; init; }
    
    public required string Email { get; init; }
    public required string Password { get; init; }
}