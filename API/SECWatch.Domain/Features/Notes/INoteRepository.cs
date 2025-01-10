using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Domain.Features.Notes;

public interface INoteRepository
{
    Task<Note?> AddAsync(Note note);
    
    Task<Note?> GetByIdAsync(Guid id);
    
    Task<IReadOnlyList<Note>> GetUserNotesAsync(Guid userId);
    
    Task<IReadOnlyList<Note>> GetUserCompanyNotesAsync(Guid userId, string cik);
    
    Task<IReadOnlyList<Note>> GetUserFilingNotesAsync(Guid userId, string accessionNumber);
}