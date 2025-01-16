using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Domain.Features.Companies.Models;

public class TrackedCompany : AggregateRoot
{
    public Guid UserId { get; private set; }
    public User User { get; private set; }
    
    public Guid CompanyId { get; private set; }
    public Company Company { get; private set; }
    
    public DateTime DateAdded { get; private set; }
    
    public DateTime LastEvent { get; private set; }
    public DateTime LastUpdated { get; set; }

    public static TrackedCompany Create(Guid userId, Guid companyId)
    {
        var trackedCompany = new TrackedCompany
        {
            UserId = userId,
            CompanyId = companyId,
            DateAdded = DateTime.UtcNow,
            LastUpdated = DateTime.UtcNow
        };

        return trackedCompany;
    }
}