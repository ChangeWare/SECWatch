using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.API.Features.Notes.DTOs;

public record CreateNoteTagRequest
{
    public required TransactTagInfo Tag { get; set; }
}