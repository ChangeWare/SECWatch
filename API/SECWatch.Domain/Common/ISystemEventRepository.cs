namespace SECWatch.Domain.Common;

public interface ISystemEventRepository
{
    Task<SystemEvent> StoreEventAsync(SystemEvent systemEvent);
    
    Task<IEnumerable<SystemEvent>> QueryEventsAsync(SystemEventQuery eventQuery);
}