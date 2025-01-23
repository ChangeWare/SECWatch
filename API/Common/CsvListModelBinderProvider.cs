using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SECWatch.API.Common;

public class CsvListModelBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        ArgumentNullException.ThrowIfNull(context);

        if (context.Metadata.ModelType == typeof(List<string>))
        {
            return new CsvListModelBinder();
        }

        return null;
    }
}