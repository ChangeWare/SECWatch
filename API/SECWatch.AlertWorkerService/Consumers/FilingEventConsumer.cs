using AlertWorkerService.Contracts;
using MassTransit;
using SECWatch.Application.Features.Alerts.Services;
using SECWatch.Domain.Features.Alerts.Models;

namespace AlertWorkerService.Consumers;

public class FilingEventConsumer(
    ILogger<FilingEventConsumer> logger,
    IAlertRulesEngine rulesEngine,
    IPublishEndpoint publishEndpoint)
    : IConsumer<FilingEvent>
{
    public async Task Consume(ConsumeContext<FilingEvent> context)
    {
        var filing = context.Message;
        
        logger.LogInformation(
            "Processing filing event {EventId} for CIK {Cik}", 
            filing.EventId, 
            filing.Cik
        );

        var matchingRules = await rulesEngine.GetMatchingFilingRulesAsync(filing);

        foreach (var rule in matchingRules)
        {
            await publishEndpoint.Publish(new FilingAlertNotificationEvent
            {
                AlertRuleId = rule.Id,
                UserId = rule.UserId,
                CompanyCik = rule.Company.Cik,
                EventId = filing.EventId,
                FormType = filing.Data.FormType,
                FilingDate = filing.Data.FilingDate,
                AccessionNumber = filing.Data.AccessionNumber
            });
        }
    }
}