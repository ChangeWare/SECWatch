using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.Services;

public record FilingAlertRuleMatch
{
    public FilingEventData Filing { get; init; }
    
    public AlertRule Rule { get; init; }
}