namespace SECWatch.Application.Features.Notes.DTOs;

public record NoteDetails
{
    public Guid Id { get; init; }
    
    public required string Content { get; init; }
    
    public required string Color { get; init; }
}