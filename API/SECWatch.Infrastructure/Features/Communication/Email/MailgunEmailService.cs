using System.Net.Http.Headers;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Authentication;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Domain.Features.Users.Models;
using SECWatch.EmailTemplates.Models;
using SECWatch.EmailTemplates.Views;

namespace SECWatch.Infrastructure.Features.Communication.Email;

public class MailgunEmailService(
    ILogger<EmailService> logger,
    ICompanyRepository companyRepository,
    IEmailRenderer emailRenderer,
    IConfiguration configuration)
    : IEmailService
{
    public async Task SendDailyFilingDigestAsync(User user, IEnumerable<AlertNotification> notifications)
    {
        try
        {
            var notificationsByCompany = await GroupNotificationsByCompany(notifications);
            
            var parameters = new Dictionary<string, object?>
            {
                { nameof(NewFilingsDailyDigestEmail.NotificationsByCompany), notificationsByCompany}
            };
            
            var emailBody = await emailRenderer.RenderEmailAsync<NewFilingsDailyDigestEmail>(parameters);
            
            var client = new HttpClient();
            var mailgunDomain = configuration["Mailgun:Domain"];
            var mailgunApiKey = configuration["Mailgun:ApiKey"];
            
            var content = new MultipartFormDataContent
            {
                { new StringContent(user.Email), "to" },
                { new StringContent("SEC Filing Digest", Encoding.UTF8), "subject" },
                { new StringContent(emailBody), "html" },
                { new StringContent("secwatch@changeware.net"), "from" }
            };

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
                "Basic",
                Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{mailgunApiKey}"))
            );

            var response = await client.PostAsync(
                $"https://api.mailgun.net/v3/{mailgunDomain}/messages",
                content
            );

            response.EnsureSuccessStatusCode();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send daily digest to {Email}", user.Email);
            throw;
        }
    }

    public async Task SendVerificationEmailAsync(User user, VerificationToken token)
    {
        var parameters = new Dictionary<string, object?>
        {
            { nameof(WelcomeEmail.FirstName), user.FirstName},
            //{ nameof(WelcomeEmail.VerificationLink), $"https://secwatch.changeware.net/verify-email?token={token.Token}"}
        };
            
        var emailBody = await emailRenderer.RenderEmailAsync<WelcomeEmail>(parameters);
        
        var client = new HttpClient();
        var mailgunDomain = configuration["Mailgun:Domain"];
        var mailgunApiKey = configuration["Mailgun:ApiKey"];
            
        var content = new MultipartFormDataContent
        {
            { new StringContent(user.Email), "to" },
            { new StringContent("Welcome to SECWatch!", Encoding.UTF8), "subject" },
            { new StringContent(emailBody), "html" },
            { new StringContent("secwatch@changeware.net"), "from" }
        };

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Basic",
            Convert.ToBase64String(Encoding.ASCII.GetBytes($"api:{mailgunApiKey}"))
        );

        var response = await client.PostAsync(
            $"https://api.mailgun.net/v3/{mailgunDomain}/messages",
            content
        );

        response.EnsureSuccessStatusCode();
    }

    private async Task<List<CompanyNotificationGroup>> GroupNotificationsByCompany(
        IEnumerable<AlertNotification> notifications)
    {
        var groups = new List<CompanyNotificationGroup>();
        
        var byCik = notifications.GroupBy(n => n.CompanyCik);
        
        foreach (var group in byCik)
        {
            var company = await companyRepository.GetCompanyAsync(group.Key);
            
            if (company == null)
            {
                throw new InvalidOperationException($"Company with CIK {group.Key} not found");
            }
            
            groups.Add(new CompanyNotificationGroup
            {
                CompanyName = company.Name,
                CompanyCik = company.Cik,
                CompanyTicker = company.Ticker ?? "",
                Notifications = group.Select(n => new FilingNotificationInfo
                {
                    FormType = n.FormType,
                    FilingDate = n.FilingDate,
                    AccessionNumber = n.AccessionNumber
                }).ToList()
            });
        }

        return groups.OrderBy(g => g.CompanyName).ToList();
    }
}