using System.Collections.ObjectModel;
using AutoMapper;
using FluentResults;
using SECWatch.Application.Features.Alerts.DTOs;
using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Alerts.Models;
using SECWatch.Domain.Features.Alerts.Repositories;
using SECWatch.Domain.Features.Companies.Repositories;

namespace SECWatch.Application.Features.Alerts.Services;

public class AlertNotificationService(
    IAlertNotificationRepository alertNotificationRepository,
    ICompanyRepository companyRepository,
    IMapper mapper
    ) : IAlertNotificationService
{
    public async Task<Result<ReadOnlyCollection<IAlertNotificationInfo>>> GetAlertNotificationsForUserAsync(Guid userId)
    {
        var notifications = await alertNotificationRepository.GetAlertNotificationsForUserAsync(userId);

        var notificationDtos = await Task.WhenAll(notifications.Select<AlertNotification, Task<IAlertNotificationInfo>>(async n =>
        {
            if (n.EventType == AlertNotificationType.FilingAlert)
            {
                if (n.CompanyCik == null)
                {
                    return null;
                }
                
                var company = await companyRepository.GetCompanyAsync(n.CompanyCik);
                var companyDetails = mapper.Map<CompanyDetails>(company);
                
                
                return mapper.Map<FilingAlertNotificationInfo>(n) with { Company = companyDetails };
            }
            
            return null;
        }));
        
        return Result.Ok(notificationDtos.ToList().AsReadOnly());
    }

    public async Task<Result> MarkAlertNotificationAsViewedAsync(Guid userId, Guid notificationId)
    {
        var notification = await alertNotificationRepository.GetAlertNotificationByIdAsync(notificationId);
        if (notification == null)
        {
            return Result.Fail("Notification not found");
        }
        
        if (notification.UserId != userId)
        {
            return Result.Fail("Notification does not belong to the user");
        }
        
        notification.IsViewed = true;
        notification.ViewedAt = DateTime.UtcNow;
        
        await alertNotificationRepository.UpdateAsync(notification);
        
        return Result.Ok();
    }

    public async Task<Result> MarkAlertNotificationAsDismissedAsync(Guid userId, Guid notificationId)
    {
        var notification = await alertNotificationRepository.GetAlertNotificationByIdAsync(notificationId);
        if (notification == null)
        {
            return Result.Fail("Notification not found");
        }
        
        if (notification.UserId != userId)
        {
            return Result.Fail("Notification does not belong to the user");
        }
        
        notification.IsDismissed = true;
        
        await alertNotificationRepository.UpdateAsync(notification);
        
        return Result.Ok();
    }
}