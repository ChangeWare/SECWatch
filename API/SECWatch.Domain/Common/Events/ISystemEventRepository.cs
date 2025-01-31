namespace SECWatch.Domain.Common.Events;

public interface ISystemEventRepository
{
    Task<SystemEvent> StoreEventAsync(SystemEvent systemEvent);
    
    Task<IEnumerable<SystemEvent>> QueryEventsAsync(SystemEventQuery eventQuery);
}