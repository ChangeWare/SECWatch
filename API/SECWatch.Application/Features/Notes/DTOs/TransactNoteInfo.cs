using System.Text.Json.Serialization;

namespace SECWatch.Application.Features.Notes.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(TransactFilingNoteInfo), typeDiscriminator: "filing")]
public abstract record TransactNoteInfo
{
    public required string Content { get; init; }
    
    public required string Color { get; init; }
}