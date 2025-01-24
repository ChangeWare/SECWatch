using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Alerts.Models;

public class UserNotificationGroup
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public List<FilingAlertNotification> Notifications { get; set; } = [];
}