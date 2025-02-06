namespace SECWatch.Application.Features.Alerts.DTOs;

public record FilingAlertRuleInfo : AlertRuleInfo
{
    public required IReadOnlyList<string> FormTypes { get; init; }
}