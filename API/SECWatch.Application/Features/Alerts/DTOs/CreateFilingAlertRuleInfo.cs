namespace SECWatch.Application.Features.Alerts.DTOs;

public record CreateFilingAlertRuleInfo : CreateAlertRuleInfo
{
    public required List<string> FormTypes { get; set; }
}