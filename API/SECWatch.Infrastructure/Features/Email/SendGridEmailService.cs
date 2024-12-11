using SECWatch.Application.Features.Communication.Services;
using SECWatch.Domain.Features.Authentication;

namespace SECWatch.Infrastructure.Features.Email;

public class SendGridEmailService : IEmailService
{
    public Task SendEmailAsync(string email, string subject, string message)
    {
        throw new NotImplementedException();
    }

    public Task SendVerificationEmailAsync(string email, VerificationToken token)
    {
        throw new NotImplementedException();
    }
}