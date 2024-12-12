namespace SECWatch.Domain.Common;

public abstract class AggregateRoot : IEntity
{
    public Guid Id { get; init; } = Guid.NewGuid();
}