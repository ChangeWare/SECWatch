using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Application.Features.Communication.Email.Services;

public interface IEmailService
{
    Task SendDailyFilingDigestAsync(User user, IEnumerable<FilingAlertNotification> notifications);
    
    Task SendVerificationEmailAsync(User user, VerificationToken token);
}