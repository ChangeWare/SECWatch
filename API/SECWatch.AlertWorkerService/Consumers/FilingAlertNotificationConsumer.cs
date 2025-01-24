using AlertWorkerService.Contracts;
using MassTransit;
using SECWatch.Application.Features.Communication.Email.Services;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;

namespace AlertWorkerService.Consumers;

public class FilingAlertNotificationConsumer(
    ILogger<FilingAlertNotificationConsumer> logger,
    IFilingAlertNotificationRepository notificationRepository,
    IEmailService emailService)
    : IConsumer<FilingAlertNotificationEvent>
{
    public async Task Consume(ConsumeContext<FilingAlertNotificationEvent> context)
    {
        var notification = context.Message;

        // Create notification record
        var alert = await notificationRepository.AddAsync(new FilingAlertNotification
        {
            FilingAlertRuleId = notification.AlertRuleId,
            UserId = notification.UserId,
            CompanyCik = notification.CompanyCik,
            EventId = notification.EventId,
            IsViewed = false,
            IsEmailSent = false,
            EventType = "Filing",
            FormType = notification.FormType,
            FilingDate = notification.FilingDate,
            IsDismissed = false,
            CreatedAt = DateTime.UtcNow
        });
    }
}