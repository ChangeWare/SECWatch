using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public class CreateAlertRuleRequest
{
    public required CreateAlertRuleInfo Rule { get; init; }
}