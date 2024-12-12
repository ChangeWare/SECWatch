namespace SECWatch.Application.Features.Users.DTOs;

public record RegisterUserRequest(
    string Email,
    string FirstName,
    string LastName,
    string CompanyName,
    string Password
);