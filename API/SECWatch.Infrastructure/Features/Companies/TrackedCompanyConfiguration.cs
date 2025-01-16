using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SECWatch.Domain.Features.Companies.Models;

namespace SECWatch.Infrastructure.Features.Companies;

public class TrackedCompanyConfiguration: IEntityTypeConfiguration<TrackedCompany>
{
    public void Configure(EntityTypeBuilder<TrackedCompany> builder)
    {
        builder.ToTable("TrackedCompanies");
        
        builder.HasKey(tc => tc.Id);
        builder.HasIndex(tc => new { tc.CompanyId, tc.UserId });
    }
}