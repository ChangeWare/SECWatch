using SECWatch.Domain.Common;

namespace SECWatch.Domain.Features.Companies.Models;

public class CompanyFilingsHistoryMetadata
{
    public DateTime FirstFiled { get; set; }
    public DateTime LastFiled { get; set; }
    public DateTime LastFetched { get; set; }
    
    public int TotalFilings { get; set; }
    public IReadOnlyList<string> FormTypes { get; set; }
    
    public DateRange DateRange { get; set; }
}

public class CompanyFiling
{
    public string AccessionNumber { get; set; }
    public DateTime FilingDate { get; set; }
    public DateTime? ReportDate { get; set; }
    
    public string Act { get; set; }
    public string Form { get; set; }
    public string FileNumber { get; set; }
    public string FilmNumber { get; set; }
    public string Items { get; set; }
    public int Size { get; set; }
    public bool IsXBRL { get; set; }
    public bool IsInlineXBRL { get; set; }
    public string PrimaryDocument { get; set; }
    public string PrimaryDocDescription { get; set; }
    
}

public class CompanyFilingHistory
{
    public string Id { get; set; }
    
    public string Cik { get; set; }
    
    public CompanyFilingsHistoryMetadata Metadata { get; set; }
    
    public CompanyFiling? MostRecentFiling { get; set; }
    
    public IReadOnlyList<CompanyFiling> Filings { get; set; }
}