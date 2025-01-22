using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Companies.Models;

public class CompanyUserDashboardPreferences : AggregateRoot
{
    public Guid UserId { get; private set; }
    public User User { get; private set; }
    
    public Guid CompanyId { get; private set; }
    public Company Company { get; private set; }
    
    public List<string> PinnedConcepts { get; private set; }

    public static CompanyUserDashboardPreferences Create(Guid userId, Guid companyId)
    {
        var userCompanyDashboardPreferences = new CompanyUserDashboardPreferences
        {
            UserId = userId,
            CompanyId = companyId,
            PinnedConcepts = ["NET_INCOME_LOSS"]
        };
        
        return userCompanyDashboardPreferences;
    }
    
    public void AddPinnedConcept(string concept)
    {
        if (PinnedConcepts.Contains(concept))
        {
            return;
        }
        
        PinnedConcepts.Add(concept);
    }
}