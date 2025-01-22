using System.Reflection;
using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Common;
using SECWatch.Domain.Features.Companies.Models;
using SECWatch.Domain.Features.Notes.Models;
using SECWatch.Domain.Features.Users.Models;

namespace SECWatch.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IApplicationDbContext
{
    public DbSet<User> Users => Set<User>();
    
    public DbSet<Company> Companies => Set<Company>();
    
    public DbSet<TrackedCompany> TrackedCompanies => Set<TrackedCompany>();
    
    public DbSet<CompanyUserDashboardPreferences> CompanyUserDashboardPreferences => Set<CompanyUserDashboardPreferences>();

    public DbSet<Note> Notes => Set<Note>();
    
    public DbSet<SystemEvent> SystemEvents => Set<SystemEvent>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        base.OnModelCreating(builder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var result = await base.SaveChangesAsync(cancellationToken);
        return result;
    }
}