using FluentResults;
using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Common;
using SECWatch.API.Features.Alerts.DTOs;
using SECWatch.API.Features.Authentication;
using SECWatch.Application.Common.Utils;
using SECWatch.Application.Features.Alerts.Services;

namespace SECWatch.API.Features.Alerts;

[ApiController]
[Route("api/alerts/notifications")]
[RequireAuth]
public class AlertNotificationsController(IAlertNotificationService alertNotificationService) : ControllerBase
{
    
    public async Task<ActionResult<UserAlertNotificationsResponse>> GetUserAlertNotifications()
    {
        var userId = User.GetUserId();
        
        var result = await alertNotificationService.GetAlertNotificationsForUserAsync(userId);

        return result.ToActionResponse(rules => new UserAlertNotificationsResponse 
        { 
            Notifications = result.Value
        });
    }
    
    [HttpPost("{notificationId}/mark-read")]
    public async Task<IActionResult> MarkAlertNotificationAsViewed(Guid notificationId)
    {
        var userId = User.GetUserId();
        
        var result = await alertNotificationService.MarkAlertNotificationAsViewedAsync(userId, notificationId);
        
        return result.ToActionResult();
    }
    
    [HttpPost("{notificationId}/mark-dismissed")]
    public async Task<IActionResult> MarkAlertNotificationAsDismissed(Guid notificationId)
    {
        var userId = User.GetUserId();
        
        var result = await alertNotificationService.MarkAlertNotificationAsDismissedAsync(userId, notificationId);
        
        return result.ToActionResult();
    }
}