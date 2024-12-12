namespace SECWatch.Application.Features.Users.DTOs;

public record VerifyEmailRequest(
    Guid UserId,
    string Token);