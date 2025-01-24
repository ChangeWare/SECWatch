using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record FilingNoteResponse
{
    public required IReadOnlyList<FilingNote> Notes { get; init; }
    
    public required int Count { get; init; }
}