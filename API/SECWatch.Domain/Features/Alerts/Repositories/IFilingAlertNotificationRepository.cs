using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Domain.Features.Alerts.Repositories;

public interface IFilingAlertNotificationRepository
{
    Task<IEnumerable<UserNotificationGroup>> GetUnprocessedNotificationsGroupedByUserAsync(DateTime since);
    
    Task<FilingAlertNotification> AddAsync(FilingAlertNotification notification);
    
    Task MarkEmailsSentAsync(List<Guid> notificationIds);
}