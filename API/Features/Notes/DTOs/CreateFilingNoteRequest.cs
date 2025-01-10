using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreateFilingNoteRequest 
{
    public required string Content { get; init; }
    
    public required string Color { get; init; }
    
    public required string AccessionNumber { get; init; }
    
    public required FilingNoteSelectionData SelectionData { get; init; }
}