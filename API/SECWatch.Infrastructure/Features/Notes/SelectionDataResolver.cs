using Newtonsoft.Json;
using SECWatch.Domain.Features.Notes;
using SECWatch.Domain.Features.Notes.Models;

namespace SECWatch.Infrastructure.Features.Notes;

public class SelectionDataResolver : ISelectionDataResolver
{

    public T? Resolve<T>(Note src)
    {
        return JsonConvert.DeserializeObject<T>(src.SelectionData);
    }
}