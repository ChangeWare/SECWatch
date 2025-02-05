using AutoMapper;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.DTOs.Configurations;

public class AlertNotificationMapper : Profile
{
    public AlertNotificationMapper()
    {
        CreateMap<AlertNotification, FilingAlertNotificationInfo>();
    }
}