namespace SECWatch.EmailTemplates.Models;

public class CompanyNotificationGroup
{
    public string CompanyName { get; set; }
    public List<FilingNotificationInfo> Notifications { get; set; } = new();
}