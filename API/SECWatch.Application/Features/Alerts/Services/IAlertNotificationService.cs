using System.Collections.ObjectModel;
using FluentResults;
using SECWatch.Application.Features.Alerts.DTOs;

namespace SECWatch.Application.Features.Alerts.Services;

public interface IAlertNotificationService
{
    Task<Result<ReadOnlyCollection<IAlertNotificationInfo>>> GetAlertNotificationsForUserAsync(Guid userId);
    
    Task<Result> MarkAlertNotificationAsViewedAsync(Guid userId, Guid notificationId);
    
    Task<Result> MarkAlertNotificationAsDismissedAsync(Guid userId, Guid notificationId);
}