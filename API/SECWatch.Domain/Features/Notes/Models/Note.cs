using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Notes.Models;

public class Note : AggregateRoot
{
    public string Content { get; private set; }
    
    public string SelectionData { get; private set; }
    
    public Guid UserId { get; private set; }
    
    public string Color { get; private set; }
    
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    
    public string? Cik { get; private set; }
    
    public string? AccessionNumber { get; private set; }
    
    public string? Form { get; private set; }
    
    public DateTime FilingDate { get; private set; }
    
    public DateTime? FilingReportDate { get; private set; }
    
    public NoteTypes NoteType { get; private set; }
    
    private Note()
    {
    }

    public static Note CreateFilingNote(Guid userId, string accessionNumber, string cik, string form, DateTime filingDate,
        DateTime? reportDate, string content, string color, string selectionData)
    {
        var note = new Note()
        {
            UserId = userId,
            AccessionNumber = accessionNumber,
            Cik = cik,
            Form = form,
            FilingDate = filingDate,
            FilingReportDate = reportDate,
            Content = content,
            CreatedAt = DateTime.UtcNow,
            Color = color,
            SelectionData = selectionData
        };

        return note;
    }
}