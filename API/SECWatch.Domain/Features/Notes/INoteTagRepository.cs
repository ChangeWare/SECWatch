using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Domain.Features.Notes;

public interface INoteTagRepository
{
    Task<IReadOnlyList<NoteTag>> GetNoteTagsAsync(Guid noteId);
    
    Task<NoteTag?> GetNoteTagByIdAsync(Guid noteTagId);
    
    Task<Dictionary<Guid, IReadOnlyList<NoteTag>>> GetNoteTagsByNoteAsync(IEnumerable<Guid> noteIds);
    
    Task<NoteTag?> AddAsync(NoteTag noteTag);
    
    Task DeleteAsync(NoteTag noteTag);
}