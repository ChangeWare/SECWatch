using System.Text.Json.Serialization;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Alerts.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(FilingAlertRuleInfo), typeDiscriminator: "filing")]
public abstract record AlertRuleInfo
{
    public required Guid Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    
    public required bool IsEnabled { get; init; }
    
    public required DateTime? LastTriggeredAt { get; init; }
    
    public required CompanyDetails Company { get; init; }
}