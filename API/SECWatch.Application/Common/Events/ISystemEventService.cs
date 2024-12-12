namespace SECWatch.Application.Common;

public interface ISystemEventService
{
    Task TrackEventAsync(
        string eventType,
        string category,
        Guid? userId,
        Guid entityId,
        Dictionary<string, string> eventMetadata);
}