using Quartz;
using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Domain.Features.Alerts.Repositories;

namespace SECWatch.AlertWorkerService.Jobs;

public class FilingAlertEmailDigestJob(
    IAlertNotificationRepository notificationRepository,
    IEmailService emailService,
    ILogger<FilingAlertEmailDigestJob> logger)
    : IJob
{
    public async Task Execute(IJobExecutionContext context)
    {
        // Get notifications since last digest, grouped by user
        var userNotifications = await notificationRepository.GetUnprocessedNotificationsGroupedByUserAsync(
            DateTime.UtcNow.AddHours(-24)
        );

        foreach (var userGroup in userNotifications)
        {
            try
            {
                await emailService.SendDailyFilingDigestAsync(
                    user: userGroup.User!,
                    notifications: userGroup.Notifications
                );
                
                await notificationRepository.MarkEmailsSentAsync(
                    userGroup.Notifications.Select(n => n.Id).ToList()
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, 
                    "Failed to send digest email for user {UserId}", 
                    userGroup.UserId);
            }
        }
    }
}