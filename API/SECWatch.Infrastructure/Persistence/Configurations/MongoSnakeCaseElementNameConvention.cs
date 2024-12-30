using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;

namespace SECWatch.Infrastructure.Persistence.Configurations;

public class MongoSnakeCaseElementNameConvention : IMemberMapConvention
{
    public string Name => "SnakeCaseElementNameConvention";

    public void Apply(BsonMemberMap memberMap)
    {
        var propertyName = memberMap.MemberName;
        var snakeCaseName = string.Concat(propertyName.Select((c, i) =>
            i > 0 && char.IsUpper(c) ? "_" + c.ToString().ToLower() : c.ToString().ToLower()));
        memberMap.SetElementName(snakeCaseName);
    }
}