namespace SECWatch.Application.Features.Notes.DTOs;

public record TableData
{
    public required bool EntireTable { get; init; }
    public required string TableXPath { get; init; }
}

public record FilingNoteSelectionData
{
    public required string StartXPath { get; init; }
    
    public required int StartOffset { get; init; }
    
    public required string EndXPath { get; init; }
    
    public required int EndOffset { get; init; }
    
    public required string SelectedText { get; init; }
    
    public required string SelectionType { get; init; }
    
    public TableData? TableData { get; init; }
}