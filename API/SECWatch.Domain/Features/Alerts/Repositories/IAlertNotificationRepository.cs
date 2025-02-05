using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IAlertNotificationRepository
{
    Task<AlertNotification?> GetAlertNotificationByIdAsync(Guid id);
    
    Task<IEnumerable<AlertNotification>> GetAlertNotificationsForUserAsync(Guid userId);
    
    Task<IEnumerable<UserNotificationGroup>> GetUnprocessedNotificationsGroupedByUserAsync(DateTime since);
    
    Task<AlertNotification> AddAsync(AlertNotification notification);
    
    Task<AlertNotification> UpdateAsync(AlertNotification notification);
    
    Task MarkEmailsSentAsync(List<Guid> notificationIds);
}