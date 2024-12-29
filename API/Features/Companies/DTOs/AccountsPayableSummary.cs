namespace SECWatch.API.Features.Companies.DTOs;

public record class AccountsPayableSummary
{
    public decimal CurrentValue { get; set; }
    public decimal PreviousQuarterValue { get; set; }
    public decimal PreviousYearValue { get; set; }
    public decimal QuarterOverQuarterChange { get; set; }
    public decimal YearOverYearChange { get; set; }
}