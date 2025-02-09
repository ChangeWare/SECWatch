using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Notes;

public class NoteTagRepository(ApplicationDbContext dbContext) : INoteTagRepository
{
    public async Task<IReadOnlyList<NoteTag>> GetNoteTagsAsync(Guid noteId)
    {
        return await dbContext.NoteTags.
            Where(x => x.NoteId == noteId)
            .ToListAsync();
    }

    public async Task<NoteTag?> GetNoteTagByIdAsync(Guid noteTagId)
    {
        return await dbContext.NoteTags
            .FirstOrDefaultAsync(x => x.Id == noteTagId);
    }

    public async Task<IReadOnlyList<Tag>> GetTagsForUserAsync(Guid userId)
    {
        return await dbContext.Tags
            .Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<Tag?> GetTagByIdAsync(Guid tagId)
    {
        return await dbContext.Tags
            .FirstOrDefaultAsync(x => x.Id == tagId);
    }

    public async Task<Dictionary<Guid, IReadOnlyList<NoteTag>>> GetNoteTagsByNoteAsync(IEnumerable<Guid> noteIds)
    {
        var noteTags = await dbContext.NoteTags
            .Where(x => noteIds.Contains(x.NoteId))
            .ToListAsync();

        return noteTags
            .GroupBy(x => x.NoteId)
            .ToDictionary(x => x.Key, x => x.ToList() as IReadOnlyList<NoteTag>);
    }
    
    public async Task<Dictionary<Guid, Tag>> GetTagsByIdsAsync(IEnumerable<Guid> tagIds)
    {
        return await dbContext.Tags
            .Where(x => tagIds.Contains(x.Id))
            .ToDictionaryAsync(x => x.Id);
    }

    public async Task<Tag?> AddTagAsync(Tag noteTag)
    {
        var entry = await dbContext.Tags.AddAsync(noteTag);
        await dbContext.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<NoteTag?> AddNoteTagAsync(NoteTag noteTag)
    {
        var entry = await dbContext.NoteTags.AddAsync(noteTag);
        await dbContext.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task DeleteAsync(NoteTag noteTag)
    {
        dbContext.NoteTags.Remove(noteTag);
        await dbContext.SaveChangesAsync();
    }
}