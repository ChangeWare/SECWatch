using System.Text.Json.Serialization;

namespace SECWatch.Domain.Features.Alerts.Models;

public record FilingEvent
{
    public required string Cik { get; init; }
    
    [JsonPropertyName("event_type")]
    public required string EventType { get; init; }
    
    [JsonPropertyName("event_id")]
    public required string EventId { get; init; }
    
    public required DateTime Timestamp { get; init; }
    
    public required List<FilingEventData> Filings { get; init; }
}

public record FilingEventData
{
    [JsonPropertyName("form_type")]
    public required string FormType { get; init; }
    
    [JsonPropertyName("filing_date")]
    public required DateTime FilingDate { get; init; }
    
    [JsonPropertyName("accession_number")]
    public required string AccessionNumber { get; init; }
}