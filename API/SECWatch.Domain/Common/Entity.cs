namespace SECWatch.Domain.Common;

public interface IEntity
{
    public Guid Id { get; protected init; } 
}