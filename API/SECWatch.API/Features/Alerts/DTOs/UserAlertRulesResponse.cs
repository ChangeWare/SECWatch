using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.API.Features.Alerts.DTOs;

public record UserAlertRulesResponse
{
    public required IReadOnlyList<AlertRuleInfo> Rules { get; init; }
}