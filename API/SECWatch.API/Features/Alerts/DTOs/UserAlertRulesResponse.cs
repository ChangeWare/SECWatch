using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public class UserAlertRulesResponse
{
    public required IReadOnlyList<IAlertRuleInfo> Rules { get; init; }
}