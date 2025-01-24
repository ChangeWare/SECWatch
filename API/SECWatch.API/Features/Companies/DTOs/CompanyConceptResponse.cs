using SECWatch.Application.Features.Companies.DTOs;

namespace SECWatch.API.Features.Companies.DTOs;

public record CompanyConceptResponse
{
    public required CompanyConceptDto Concept { get; init;  }
}