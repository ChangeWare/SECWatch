using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Logging;

namespace SECWatch.Infrastructure.Features.Communication.Email;

public class EmailRenderer(IServiceProvider serviceProvider, ILoggerFactory loggerFactory)
    : IEmailRenderer
{
    private readonly HtmlRenderer _htmlRenderer = new(serviceProvider, loggerFactory);
    
    public async Task<string> RenderEmailAsync<TComponent>(IDictionary<string, object?> parameters) where TComponent : IComponent
    {
        
        var parameterView = ParameterView.FromDictionary(parameters);
        
        var htmlContent = await _htmlRenderer.Dispatcher.InvokeAsync(async () =>
        {
            var result = await _htmlRenderer.RenderComponentAsync<TComponent>(parameterView);
            return result.ToHtmlString();
        });
        
        return htmlContent;
    }
}