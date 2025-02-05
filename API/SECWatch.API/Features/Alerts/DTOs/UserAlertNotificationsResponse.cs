namespace SECWatch.API.Features.Alerts.DTOs;

public record UserAlertNotificationsResponse
{
    public required IReadOnlyList<IAlertNotificationInfo> Notifications { get; init; }
}