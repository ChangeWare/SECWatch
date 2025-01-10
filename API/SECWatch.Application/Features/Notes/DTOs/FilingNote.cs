namespace SECWatch.Application.Features.Notes.DTOs;

public record FilingNote : NoteDetails
{
    public required string AccessionNumber { get; init; }
    
    public required FilingNoteSelectionData SelectionData { get; init; }
}