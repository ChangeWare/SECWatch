using MongoDB.Driver;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Companies.Repositories;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Features.Companies.Repositories;

public class CompanyConceptRepository(
    IMongoDbContext mongoDbContext) : ICompanyConceptRepository
{
    public async Task<IReadOnlyList<CompanyConcept>> GetCompanyConceptsAsync(string cik, List<string> conceptTypes)
    {
        // Grab only the concepts that match the concept types
        var filter = Builders<CompanyConcept>.Filter.And(
            Builders<CompanyConcept>.Filter.Eq(x => x.Cik, cik),
            Builders<CompanyConcept>.Filter.In(x => x.ConceptType, conceptTypes)
        );
        
        
        var concepts = await mongoDbContext
            .GetCollection<CompanyConcept>("company_concepts")
            .Find(filter).ToListAsync();

        return concepts.AsReadOnly();
    }

    public async Task<IReadOnlyList<CompanyConcept>> GetAllCompanyConceptsAsync(string cik)
    {
        // Grab all concepts for the company
        var filter = Builders<CompanyConcept>.Filter.Eq(x => x.Cik, cik);
        
        var concepts = await mongoDbContext
            .GetCollection<CompanyConcept>("company_concepts")
            .Find(filter).ToListAsync();

        return concepts.AsReadOnly();
    }

    public async Task<IReadOnlyList<string>> GetCompanyConceptTypesAsync(string cik)
    {
        var filter = Builders<CompanyConceptsMetadata>.Filter.Eq(x => x.Cik, cik);
        
        var result = await mongoDbContext
            .GetCollection<CompanyConceptsMetadata>("company_concepts_metadata")
            .FindAsync(filter);

        return result.FirstOrDefault()?.ConceptTypes ?? new List<string>();
    }

    public async Task<CompanyConcept> GetCompanyConceptAsync(
        string cik, 
        string conceptType)
    {
        var filter = Builders<CompanyConcept>.Filter.And(
            Builders<CompanyConcept>.Filter.Eq(x => x.Cik, cik),
            Builders<CompanyConcept>.Filter.Eq(x => x.ConceptType, conceptType)
        );

        var concept = await mongoDbContext
            .GetCollection<CompanyConcept>("company_concepts")
            .Find(filter).FirstOrDefaultAsync();
        
        return concept;
    }
}