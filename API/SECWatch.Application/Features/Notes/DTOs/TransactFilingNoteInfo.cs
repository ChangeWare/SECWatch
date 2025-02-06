namespace SECWatch.Application.Features.Notes.DTOs;

public record TransactFilingNoteInfo : TransactNoteInfo
{
    public required string AccessionNumber { get; init; }
    
    public required string Cik { get; init; }
    
    public required string Form { get; init; }
    
    public required DateTime FilingDate { get; init; }
    
    public DateTime? ReportDate { get; init; }
    
    public required FilingNoteSelectionData SelectionData { get; init; }
}