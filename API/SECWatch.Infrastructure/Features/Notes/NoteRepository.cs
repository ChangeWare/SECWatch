using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Notes;

public class NoteRepository(ApplicationDbContext context) : INoteRepository
{
    public async Task<Note?> AddAsync(Note note)
    {
        await context.Notes.AddAsync(note);
        await context.SaveChangesAsync();
        return note;
    }

    public async Task<Note?> GetByIdAsync(Guid id)
    {
        return await context.Notes.FindAsync(id);
    }

    public async Task<IReadOnlyList<Note>> GetUserNotesAsync(Guid userId)
    {
        return await context.Notes.
            Where(x => x.UserId == userId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Note>> GetUserCompanyNotesAsync(Guid userId, string cik)
    {
        return await context.Notes
            .Include(x => x.Subject)
            .Where(x => x.UserId == userId && 
                        x.Subject.Type == "Company" &&
                        x.Subject.Cik == cik)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Note>> GetUserFilingNotesAsync(Guid userId, string accessionNumber) 
    {
        return await context.Notes
            .Include(x => x.Subject)
            .Where(x => x.UserId == userId &&
                        x.Subject.Type == "Filing" &&
                        x.Subject.AccessionNumber == accessionNumber)
            .ToListAsync(); 
    }
}