namespace SECWatch.Application.Features.Notes.DTOs;

public record FilingNoteSelectionData
{
    public required long StartOffset { get; init; }
    
    public required long EndOffset { get; init; }
    
    public required string SelectedText { get; init; }
}