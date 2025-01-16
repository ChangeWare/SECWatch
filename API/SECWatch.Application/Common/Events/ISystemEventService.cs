namespace SECWatch.Application.Common.Events;

public interface ISystemEventService
{
    Task TrackEventAsync(
        string eventType,
        string category,
        Guid? userId,
        Guid entityId,
        Dictionary<string, string> eventMetadata);
}