using SECWatch.Application.Features.Companies.DTOs;
using SECWatch.Domain.Features.Notes;

namespace SECWatch.Application.Features.Notes.DTOs;

public record FilingNoteInfo : INoteInfo
{
    public required string AccessionNumber { get; init; }
    
    public required string Cik { get; init; }
    
    public required string Form { get; init; }
    
    public required CompanyDetails? Company { get; set; }
    
    public required DateTime FilingDate { get; init; }
    
    public DateTime? ReportDate { get; init; }
    
    public required FilingNoteSelectionData SelectionData { get; init; }
    
    public required NoteTypes NoteType { get; init; }
    
    public required DateTime? UpdatedAt { get; init; }
    
    public required Guid UserId { get; init; }
}
