using Microsoft.EntityFrameworkCore;
using SECWatch.Domain.Common.Events;
using SECWatch.Infrastructure.Persistence;

namespace SECWatch.Infrastructure.Common;

public class SystemEventRepository(ApplicationDbContext dbContext) : ISystemEventRepository
{
    public async Task<SystemEvent> StoreEventAsync(SystemEvent systemEvent)
    {
        var result = await dbContext.SystemEvents.AddAsync(systemEvent);
        await dbContext.SaveChangesAsync();

        return result.Entity;
    }

    public async Task<IEnumerable<SystemEvent>> QueryEventsAsync(SystemEventQuery eventQuery)
    {
        var query = dbContext.SystemEvents.AsQueryable();
        
        if (eventQuery.StartDate.HasValue)
        {
            query = query.Where(e => e.OccurredAt >= eventQuery.StartDate);
        }
        
        if (eventQuery.EndDate.HasValue)
        {
            query = query.Where(e => e.OccurredAt <= eventQuery.EndDate);
        }
        
        if (!string.IsNullOrEmpty(eventQuery.EventType))
        {
            query = query.Where(e => e.EventType == eventQuery.EventType);
        }
        
        if (!string.IsNullOrEmpty(eventQuery.Category))
        {
            query = query.Where(e => e.Category == eventQuery.Category);
        }
        
        if (eventQuery.EntityId.HasValue)
        {
            query = query.Where(e => e.EntityId == eventQuery.EntityId);
        }
        
        if (eventQuery.UserId.HasValue)
        {
            query = query.Where(e => e.UserId == eventQuery.UserId);
        }
        
        
        return await query.ToListAsync();
    }
}