using System.Text.Json.Serialization;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Alerts.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(FilingAlertRuleInfo), typeDiscriminator: "filing")]
public interface IAlertRuleInfo
{
    Guid Id { get; }
    string Name { get; }
    string Description { get; }
    DateTime CreatedAt { get; }
    
    bool IsEnabled { get; }
    
    DateTime? LastTriggeredAt { get; }
    
    CompanyDetails Company { get; }
}