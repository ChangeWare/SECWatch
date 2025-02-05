using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Alerts;

public class AlertNotificationRepository(ApplicationDbContext dbContext) : IAlertNotificationRepository
{
    public async Task<AlertNotification?> GetAlertNotificationByIdAsync(Guid id)
    {
        return await dbContext.AlertNotifications
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    /// <summary>
    /// Returns alert notifications for user up to 30 days old
    /// </summary>
    /// <param name="userId"></param>
    /// <returns></returns>
    public async Task<IEnumerable<AlertNotification>> GetAlertNotificationsForUserAsync(Guid userId)
    {
        var since = DateTime.UtcNow.AddDays(-30);
        return await dbContext.AlertNotifications
            .Where(n => 
                n.UserId == userId && 
                n.CreatedAt >= since &&
                !n.IsDismissed)
            .ToListAsync();
    }

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

    public async Task<AlertNotification> UpdateAsync(AlertNotification notification)
    {
        dbContext.AlertNotifications.Update(notification);
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