using MassTransit;
using SECWatch.Application.Features.Alerts.Services;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;

namespace SECWatch.AlertWorkerService.Consumers;

public class FilingEventConsumer(
    ILogger<FilingEventConsumer> logger,
    IAlertRulesEngine rulesEngine,
    IAlertNotificationRepository notificationRepository)
    : IConsumer<FilingEvent>
{
    public async Task Consume(ConsumeContext<FilingEvent> context)
    {
        var filingEvent = context.Message;
        
        logger.LogInformation(
            "Processing filing event {EventId} for CIK {Cik}", 
            filingEvent.EventId, 
            filingEvent.Cik
        );

        var filingAlertRuleMatches = await rulesEngine.GetFilingsMatchingRules(filingEvent);
        
        foreach (var match in filingAlertRuleMatches)
        {
            await notificationRepository.AddAsync(new AlertNotification
            {
                AlertRuleId = match.Rule.Id,
                UserId = match.Rule.UserId,
                CompanyCik = filingEvent.Cik,
                EventId = filingEvent.EventId,
                IsViewed = false,
                IsEmailSent = false,
                EventType = seAlertNotificationType.FilingAlert,
                FormType = match.Filing.FormType,
                AccessionNumber = match.Filing.AccessionNumber,
                FilingDate = match.Filing.FilingDate,
                IsDismissed = false,
                CreatedAt = DateTime.UtcNow
            });

        }
    }
}