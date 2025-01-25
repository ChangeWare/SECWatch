namespace SECWatch.EmailTemplates.Models;

public record FilingNotificationInfo
{
    public required string AccessionNumber { get; set; }
    public required string FormType { get; set; }
    public required DateTime FilingDate { get; set; }
}