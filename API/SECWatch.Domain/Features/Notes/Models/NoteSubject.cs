using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Notes.Models;

public class NoteSubject : IEntity
{
    public Guid Id { get; init; }
    
    public string Type { get; private set; }
    
    public string? Cik { get; private set; }
    
    public string? AccessionNumber { get; private set; }
    
    public static NoteSubject CreateFilingNoteSubject(string accessionNumber)
    {
        return new NoteSubject()
        {
            Type = "Filing",
            AccessionNumber = accessionNumber
        };
    }
    
    public static NoteSubject CreateCompanyNoteSubject(string cik)
    {
        return new NoteSubject()
        {
            Type = "Company",
            Cik = cik
        };
    }
}