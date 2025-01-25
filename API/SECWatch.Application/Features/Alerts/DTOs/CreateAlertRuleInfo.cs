using System.Text.Json.Serialization;

namespace SECWatch.Application.Features.Alerts.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(CreateFilingAlertRuleInfo), typeDiscriminator: "filing")]
public abstract record CreateAlertRuleInfo 
{
    public required string Name { get; set; }
    
    public required string Description { get; set; }
    
    public required string Cik { get; set; }
}