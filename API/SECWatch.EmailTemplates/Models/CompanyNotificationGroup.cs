namespace SECWatch.EmailTemplates.Models;

public record CompanyNotificationGroup
{
    public required string CompanyCik { get; init; }
    public required string CompanyName { get; init; }
    
    public required string CompanyTicker { get; init; }
    public required List<FilingNotificationInfo> Notifications { get; init; } = new();
}