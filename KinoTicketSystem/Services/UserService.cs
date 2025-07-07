using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using KinoTicketSystem.Models;
using KinoTicketSystem.DB;

namespace KinoTicketSystem.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<bool> RegisterUserAsync(string username, string password)
        {
            // Prüfen, ob der Benutzername bereits existiert
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(u => u.Username == username);
            if (existingUser != null)
            {
                Console.WriteLine("Benutzername bereits vergeben.");
                return false;
            }

            // Benutzer erstellen
            var user = new User
            {
                Username = username,
                Password = password, // Passwort wird direkt gespeichert
                Role = "user"
            };

            _dbContext.Users.Add(user);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<User?> AuthenticateAsync(string username, string password)
        {
            // Benutzer anhand von Benutzername und Passwort finden
            var user = await _dbContext.Users
                .FirstOrDefaultAsync(u => u.Username == username && u.Password == password);

            return user; // Gibt den Benutzer zurück oder `null`, wenn Authentifizierung fehlschlägt
        }
    }
}