using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public record CreateFilingAlertRuleResponse
{
    public required FilingAlertRuleInfo Rule { get; init; }
}