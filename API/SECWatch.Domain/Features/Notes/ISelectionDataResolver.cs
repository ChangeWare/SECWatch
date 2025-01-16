using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Domain.Features.Notes;

public interface ISelectionDataResolver
{
    T? Resolve<T>(Note src);
}