namespace SECWatch.Application.Features.Alerts.DTOs;

public record TransactFilingAlertRuleInfo : TransactAlertRuleInfo
{
    public required List<string> FormTypes { get; set; }
}