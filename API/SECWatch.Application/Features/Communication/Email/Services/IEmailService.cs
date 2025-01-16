using SECWatch.Domain.Features.Authentication;

namespace SECWatch.Application.Features.Communication.Email.Services;

public interface IEmailService
{
    Task SendEmailAsync(string email, string subject, string message);
    
    Task SendVerificationEmailAsync(string email, VerificationToken token);
}