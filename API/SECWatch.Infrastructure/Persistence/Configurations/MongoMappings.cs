using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using SECWatch.Domain.Features.Companies;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Infrastructure.Persistence.Configurations;

public static class MongoMappings
{
    public static void RegisterMappings()
    {
        if (!BsonClassMap.IsClassMapRegistered(typeof(CompanyFinancialMetric)))
        {
            BsonClassMap.RegisterClassMap<CompanyFinancialMetric>(cm =>
            {
                cm.AutoMap();
                cm.MapIdProperty(c => c.Id).SetSerializer(new StringSerializer(BsonType.ObjectId));
                cm.MapMember(c => c.MetricType).SetSerializer(new EnumSerializer<FinancialMetricType>(BsonType.String));
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(MetricDataPoint)))
        {
            BsonClassMap.RegisterClassMap<MetricDataPoint>(cm =>
            {
                cm.AutoMap();
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(FinancialMetricMetadata)))
        {
            BsonClassMap.RegisterClassMap<FinancialMetricMetadata>(cm =>
            {
                cm.AutoMap();
            });
        }

        if (!BsonClassMap.IsClassMapRegistered(typeof(CompanyFilingHistory)))
        {
            BsonClassMap.RegisterClassMap<CompanyFilingHistory>(cm =>
            {
                cm.AutoMap();
                cm.MapIdProperty(f => f.Id).SetSerializer(new StringSerializer(BsonType.ObjectId));
            });
        }
        
        if (!BsonClassMap.IsClassMapRegistered(typeof(CompanyFiling)))
        {
            BsonClassMap.RegisterClassMap<CompanyFiling>(cm =>
            {
                cm.AutoMap();
                cm.MapMember(c => c.IsXBRL).SetElementName("is_xbrl");
                cm.MapMember(c => c.IsInlineXBRL).SetElementName("is_inline_xbrl");
            });
        }
    }
}