using SECWatch.Domain.Common;

namespace SECWatch.Application.Common;

public class SystemEventService(ISystemEventRepository systemEventRepository) : ISystemEventService
{
    public async Task TrackEventAsync(string eventType, string category, Guid? userId, Guid entityId, Dictionary<string, string> eventMetadata)
    {
        var systemEvent = SystemEvent.Create(entityId, userId, eventType, category, eventMetadata);

        await systemEventRepository.StoreEventAsync(systemEvent);
    }
}