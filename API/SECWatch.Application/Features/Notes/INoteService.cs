using FluentResults;
using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.Application.Features.Notes;

public interface INoteService
{
    Task<Result<FilingNote>> CreateFilingNoteAsync(Guid userId, FilingNote note);
    
    Task<Result<IReadOnlyList<FilingNote>>> GetFilingNotesAsync(Guid userId, string accessionNumber);
}