using System.Text.Json.Serialization;
using SECWatch.Domain.Features.Notes;

namespace SECWatch.Application.Features.Notes.DTOs;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "NoteType")]
[JsonDerivedType(typeof(FilingNoteInfo), (int)NoteTypes.Filing)]
public abstract record INoteInfo
{
    public required Guid Id { get; init; }
    
    public required string Content { get; init; }
    
    public required string Color { get; init; }
    
    public required DateTime CreatedAt { get; init; }
    
    public required IReadOnlyList<NoteTagInfo> Tags { get; init; }
}