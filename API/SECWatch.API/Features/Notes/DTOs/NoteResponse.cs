using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreatedNoteResponse
{
    public required NoteDetails Note { get; init; }
}