using Microsoft.AspNetCore.Components;

namespace SECWatch.Infrastructure.Features.Communication.Email;

public interface IEmailRenderer
{
    Task<string> RenderEmailAsync<TComponent>(IDictionary<string, object?> parameters) where TComponent : IComponent;
}
