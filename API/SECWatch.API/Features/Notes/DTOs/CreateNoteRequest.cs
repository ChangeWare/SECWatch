using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreateNoteRequest
{
    public required TransactNoteInfo Note { get; init; }
}