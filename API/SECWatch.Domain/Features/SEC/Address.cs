namespace SECWatch.Domain.Features.SEC;

public record Address
{
    public Guid Id { get; init; }
    public string? Street { get; init; }
    public string? City { get; init; }
    public string? State { get; init; }
    public string? Zip { get; init; }
    
    public string? County { get; init; }
    
    public string? AddressType { get; init; }
    
    public int CompanyId { get; init; }
    public Company Company { get; init; }
    
    public string FullAddress => $"{Street}, {City}, {State} {Zip}";
}