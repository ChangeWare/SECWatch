using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record NotesResponse
{
    public required IReadOnlyList<INoteInfo> Notes { get; init; }
    
    public required int Count { get; init; }
}