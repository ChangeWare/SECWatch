using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Domain.Features.Notes;

public interface INoteRepository
{
    Task<Note?> AddAsync(Note note);
    
    Task DeleteAsync(Note note);
    
    Task<Note?> GetNoteByIdAsync(Guid id);
    
    Task<IReadOnlyList<Note>> GetUserNotesAsync(Guid userId);
    
    Task<IReadOnlyList<Note>> GetUserFilingNotesAsync(Guid userId, string accessionNumber);
}