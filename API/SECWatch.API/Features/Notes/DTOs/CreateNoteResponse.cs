using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreateNoteResponse
{
    public required INoteInfo Note { get; set; }
}