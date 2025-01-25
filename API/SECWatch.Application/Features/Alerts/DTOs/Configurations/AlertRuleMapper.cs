using AutoMapper;
using SECWatch.Domain.Features.Alerts.Models;

namespace SECWatch.Application.Features.Alerts.DTOs.Configurations;

public class AlertRuleMapper : Profile
{
    public AlertRuleMapper()
    {
        CreateMap<AlertRule, FilingAlertRuleInfo>();
    }
}