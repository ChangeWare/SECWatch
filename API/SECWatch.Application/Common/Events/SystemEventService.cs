using SECWatch.Domain.Common.Events;

namespace SECWatch.Application.Common.Events;

public class SystemEventService(ISystemEventRepository systemEventRepository) : ISystemEventService
{
    public async Task TrackEventAsync(string eventType, string category, Guid? userId, Guid entityId, Dictionary<string, string> eventMetadata)
    {
        var systemEvent = SystemEvent.Create(entityId, userId, eventType, category, eventMetadata);

        await systemEventRepository.StoreEventAsync(systemEvent);
    }
}