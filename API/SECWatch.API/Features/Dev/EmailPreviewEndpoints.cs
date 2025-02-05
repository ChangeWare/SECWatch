using SECWatch.EmailTemplates.Models;
using SECWatch.EmailTemplates.Views;
using SECWatch.Infrastructure.Features.Communication.Email;

namespace SECWatch.API.Features.Dev;

public static class EmailPreviewEndpoints
{
    public static void MapEmailPreviewEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/email-preview");

        group.MapGet("/daily-digest", async (IEmailRenderer emailRenderer) =>
        {
            var sampleData = new List<CompanyNotificationGroup>
            {
                new()
                {
                    CompanyCik = "0000320193",
                    CompanyName = "Apple Inc.",
                    CompanyTicker = "AAPL",
                    Notifications =
                    [
                        new FilingNotificationInfo { FormType = "10-K", FilingDate = DateTime.Today, AccessionNumber = "0000320193-21-000010" },
                        new FilingNotificationInfo { FormType = "8-K", FilingDate = DateTime.Today.AddDays(-1), AccessionNumber = "0000320193-21-000009" }
                    ]
                },
                new()
                {
                    CompanyTicker = "MSFT",
                    CompanyCik = "0000789019",
                    CompanyName = "Microsoft Corporation",
                    Notifications = [new FilingNotificationInfo { FormType = "4", FilingDate = DateTime.Today, AccessionNumber = "0000789019-21-000010" }]
                }
            };

            var parameters = new Dictionary<string, object?>
            {
                { nameof(NewFilingsDailyDigestEmail.NotificationsByCompany), sampleData }
            };

            var html = await emailRenderer.RenderEmailAsync<NewFilingsDailyDigestEmail>(parameters);
            return Results.Content(html, "text/html");
        });

        group.MapGet("/welcome", async (IEmailRenderer emailRenderer) =>
        {
            var parameters = new Dictionary<string, object?>
            {
                { nameof(WelcomeEmail.FirstName), "John" },
            };

            var html = await emailRenderer.RenderEmailAsync<WelcomeEmail>(parameters);
            return Results.Content(html, "text/html");
        });
    }
}