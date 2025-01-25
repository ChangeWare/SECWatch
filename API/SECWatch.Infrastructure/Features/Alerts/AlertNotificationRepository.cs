using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Alerts;

public class AlertNotificationRepository(ApplicationDbContext dbContext) : IAlertNotificationRepository
{
    public async Task<IEnumerable<UserNotificationGroup>> GetUnprocessedNotificationsGroupedByUserAsync(DateTime since)
    {
        return await dbContext.AlertNotifications
            .Where(n => 
                !n.IsEmailSent && 
                n.CreatedAt >= since)
            .Include(n => n.User) 
            .GroupBy(n => n.UserId)
            .Select(group => new UserNotificationGroup
            {
                UserId = group.Key,
                User = group.First().User, 
                Notifications = group.ToList()
            })
            .ToListAsync();
    }

    public async Task<AlertNotification> AddAsync(AlertNotification notification)
    {
        await dbContext.AlertNotifications.AddAsync(notification);
        await dbContext.SaveChangesAsync();
        return notification;
    }

    public async Task MarkEmailsSentAsync(List<Guid> notificationIds)
    {
        var notifications = await dbContext.AlertNotifications
            .Where(n => notificationIds.Contains(n.Id))
            .ToListAsync();

        notifications.ForEach(n => n.IsEmailSent = true);
        await dbContext.SaveChangesAsync();
    }
}