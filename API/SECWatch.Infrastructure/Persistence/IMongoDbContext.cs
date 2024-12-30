using MongoDB.Driver;

namespace SECWatch.Infrastructure.Persistence;

public interface IMongoDbContext
{
    IMongoCollection<T> GetCollection<T>(string collectionName);
}