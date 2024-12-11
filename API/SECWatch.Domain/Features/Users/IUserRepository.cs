namespace SECWatch.Domain.Features.Users;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
    Task AddAsync(User user);
    Task UpdateAsync(User user);
    
    Task SaveChangesAsync();
}