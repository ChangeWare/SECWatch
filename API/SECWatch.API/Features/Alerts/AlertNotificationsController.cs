using Microsoft.AspNetCore.Mvc;
using SECWatch.API.Features.Authentication;

namespace SECWatch.API.Features.Alerts;

[ApiController]
[Route("api/alerts/notifications")]
[RequireAuth]
public class AlertNotificationsController
{
    
    public ActionResult<UserAlertNotificationsResponse> GetUserAlertNotifications()
    {
        throw new NotImplementedException();
    }
    
}