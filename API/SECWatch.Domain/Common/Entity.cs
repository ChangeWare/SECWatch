namespace SECWatch.Domain.Common;

public abstract class Entity
{
    public string Id { get; protected set; }
    
    protected Entity()
    {
        Id = Guid.NewGuid().ToString();
    }

    public override bool Equals(object? obj)
    {
        if (obj is not Entity)
            return false;

        if (ReferenceEquals(this, obj))
            return true;

        if (GetType() != obj.GetType())
            return false;

        Entity item = (Entity)obj;

        return item.Id == Id;
    }

    public override int GetHashCode()
    {
        return Id.GetHashCode();
    }
}