namespace SECWatch.Application.Features.Users.DTOs;

public record VerifyEmailRequest(
    string UserId,
    string Token);