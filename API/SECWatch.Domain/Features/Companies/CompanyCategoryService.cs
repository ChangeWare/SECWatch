using System.Text.Json;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Domain.Features.Companies;

public interface IConceptCategoriesService
{
    CompanyConceptCategory? GetCategory(string conceptType);
}

public class ConceptCategoryService : IConceptCategoriesService
{
    private static Dictionary<string, CompanyConceptCategory> _categories;

    private Dictionary<string, CompanyConceptCategory> GetCategories()
    {
        if (_categories != null)
            return _categories;

        var path = Path.Combine(AppContext.BaseDirectory, 
            "ReferenceData", "concept_categories.json");
            
        if (!File.Exists(path))
        {
            throw new FileNotFoundException(
                $"Concept categories file not found at {path}");
        }

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        var json = File.ReadAllText(path);
        _categories = JsonSerializer.Deserialize<Dictionary<string, CompanyConceptCategory>>(json, options) ?? new Dictionary<string, CompanyConceptCategory>();
        return _categories;
    }
    
    public CompanyConceptCategory? GetCategory(string conceptType)
    {
        return GetCategories().GetValueOrDefault(conceptType);
    }
    
    
}