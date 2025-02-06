using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreateNoteTagRequest
{
    public required TransactNoteTagInfo Tag { get; set; }
}