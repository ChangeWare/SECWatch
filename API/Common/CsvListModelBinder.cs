using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace SECWatch.API.Common;

public class CsvListModelBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext == null)
        {
            throw new ArgumentNullException(nameof(bindingContext));
        }

        // Get the value from the ValueProvider
        var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);
        if (valueProviderResult == ValueProviderResult.None)
        {
            return Task.CompletedTask;
        }

        // Get the raw value (comma-separated string)
        var rawValue = valueProviderResult.FirstValue;
        if (string.IsNullOrEmpty(rawValue))
        {
            bindingContext.Result = ModelBindingResult.Success(new List<string>());
            return Task.CompletedTask;
        }

        // Split the raw value into an array of strings
        var splitValues = rawValue.Split([','], StringSplitOptions.RemoveEmptyEntries);

        // Create a List<string> from the split values
        var model = new List<string>(splitValues);

        // Set the ModelBindingResult to successful with the model
        bindingContext.Result = ModelBindingResult.Success(model);
        return Task.CompletedTask;
    }
}