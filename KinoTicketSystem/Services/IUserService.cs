using System.Threading.Tasks;
using KinoTicketSystem.Models;

namespace KinoTicketSystem.Services
{
    public interface IUserService
    {
        Task<bool> RegisterUserAsync(string username, string password);
        Task<User?> AuthenticateAsync(string username, string password);
    }
}
