using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.Extensions.Logging;

namespace SECWatch.Infrastructure.Features.Communication.Email;

public class EmailRenderer(IServiceProvider serviceProvider, ILoggerFactory loggerFactory) : IEmailRenderer
{
    public async Task<string> RenderEmailAsync<TComponent>(IDictionary<string, object?> parameters) where TComponent : IComponent
    {
        var htmlRenderer = new HtmlRenderer(serviceProvider, loggerFactory);
        
        var parameterView = ParameterView.FromDictionary(parameters);

        // Render the component
        var htmlContent = await htmlRenderer.RenderComponentAsync<TComponent>(parameterView);
        
        return htmlContent.ToHtmlString();
    }
}