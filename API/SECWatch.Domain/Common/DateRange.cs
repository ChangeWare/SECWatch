namespace SECWatch.Domain.Common;

public class Span
{
    public decimal Years { get; init; }
    public decimal Months { get; init; }
}

public class DateRange
{
    public DateTime Start { get; init;  }
    public DateTime End { get; init; }
    
    public Span Span { get; init; }
}