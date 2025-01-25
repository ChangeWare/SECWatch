using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IAlertNotificationRepository
{
    Task<IEnumerable<UserNotificationGroup>> GetUnprocessedNotificationsGroupedByUserAsync(DateTime since);
    
    Task<AlertNotification> AddAsync(AlertNotification notification);
    
    Task MarkEmailsSentAsync(List<Guid> notificationIds);
}