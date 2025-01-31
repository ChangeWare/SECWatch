using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public class UpdateAlertRuleRequest
{
    public required TransactAlertRuleInfo Rule { get; init; }
}