using System.Collections.ObjectModel;
using FluentResults;
using SECWatch.Application.Features.Notes.DTOs;

namespace SECWatch.Application.Features.Notes;

public interface INoteService
{
    Task<Result<FilingNoteInfo>> CreateFilingNoteAsync(Guid userId, TransactFilingNoteInfo noteInfo);
    
    Task<Result<IReadOnlyList<FilingNoteInfo>>> GetFilingNotesAsync(Guid userId, string accessionNumber);
    
    Task<Result<ReadOnlyCollection<INoteInfo>>> GetUserNotesAsync(Guid userId);
    
    Task<Result> AddNoteTagAsync(Guid userId, Guid noteId, TransactNoteTagInfo tagInfo);
    
    Task<Result> RemoveNoteTagAsync(Guid userId, Guid noteId, Guid tagId);
    
    Task<Result> DeleteNoteAsync(Guid userId, Guid noteId);
}