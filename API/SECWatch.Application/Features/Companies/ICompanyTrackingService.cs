using FluentResults;
using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.Application.Features.Companies;

public interface ICompanyTrackingService
{
    Task<Result<CompanyDetails>> TrackCompanyAsync(string cik, Guid userId);
    
    Task<Result<CompanyDetails>> UntrackCompanyAsync(string cik, Guid userId);

    Task<Result<IReadOnlyList<TrackedCompanyDetails>>> GetTrackedCompaniesAsync(Guid userId);
}