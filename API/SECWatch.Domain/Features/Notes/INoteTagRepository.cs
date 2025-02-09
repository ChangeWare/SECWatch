using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Domain.Features.Notes;

public interface INoteTagRepository
{
    Task<IReadOnlyList<NoteTag>> GetNoteTagsAsync(Guid noteId);
    
    Task<NoteTag?> GetNoteTagByIdAsync(Guid noteTagId);
    
    Task<Dictionary<Guid, Tag>> GetTagsByIdsAsync(IEnumerable<Guid> tagIds);
    
    Task<IReadOnlyList<Tag>> GetTagsForUserAsync(Guid userId);
    
    Task<Tag?> GetTagByIdAsync(Guid tagId);
    
    Task<Dictionary<Guid, IReadOnlyList<NoteTag>>> GetNoteTagsByNoteAsync(IEnumerable<Guid> noteIds);
    
    Task<Tag?> AddTagAsync(Tag noteTag);
    
    Task<NoteTag?> AddNoteTagAsync(NoteTag noteTag);
    
    Task DeleteAsync(NoteTag noteTag);
}