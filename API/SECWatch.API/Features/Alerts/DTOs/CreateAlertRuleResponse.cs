using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public record CreateAlertRuleResponse
{
    public required AlertRuleInfo Rule { get; init; }
}