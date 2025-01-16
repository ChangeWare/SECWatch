using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Domain.Features.Authentication;

namespace SECWatch.Infrastructure.Features.Communication.Email;

public class SendGridEmailService : IEmailService
{
    public Task SendEmailAsync(string email, string subject, string message)
    {
        Console.WriteLine("TODO HEHE");
        
        return Task.CompletedTask;
    }

    public Task SendVerificationEmailAsync(string email, VerificationToken token)
    {
        Console.WriteLine("TODO HEHE");
        
        return Task.CompletedTask;
    }
}