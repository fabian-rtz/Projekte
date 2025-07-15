using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using KinoTicketSystem.Models;
using KinoTicketSystem.Services;
using Microsoft.Extensions.Logging;  
using System.IO;

namespace KinoTicketSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;  //add logging 

        public AuthController(IUserService userService, ILogger<AuthController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest? request) //made Register request nullable 
        {
            _logger.LogInformation("Registrierungsanfrage erhalten.");

            if (request == null)
            {
                _logger.LogWarning("Register: Request body is null.");
                return BadRequest("Ungültige Anfrage. \nBitte übermitteln Sie Benutzername und Passwort.");
            }

            _logger.LogInformation("Empfangene Registrierungsdaten: Username: {Username}, Password: {Password}", request.Username, request.Password);

            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                _logger.LogWarning("Register: Username or password is missing. \nUsername: {Username}, Password: {Password}", request?.Username, request?.Password);
                return BadRequest("Benutzername und Passwort sind erforderlich.");
            }

            _logger.LogInformation("Versuche, Benutzer zu registrieren: {Username}", request.Username);
            var result = await _userService.RegisterUserAsync(request.Username, request.Password);

            if (result)
            {
                _logger.LogInformation("User {Username} successfully registered.", request.Username);
                return Ok(new { message = "Benutzer erfolgreich registriert." });
            }
            else
            {
                _logger.LogError("Failed to register user {Username}.", request.Username);
                return BadRequest("Fehler bei der Registrierung.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest? request) //made Login request nullable 
        {
            _logger.LogInformation("Loginanfrage erhalten.");

            if (request == null)
            {
                _logger.LogWarning("Login: Request body is null.");
                return BadRequest("Ungültige Anfrage. \nBitte übermitteln Sie Benutzername und Passwort.");
            }

            _logger.LogInformation("Empfangene Login-Daten: Username: {Username}, Password: {Password}", request.Username, request.Password);

            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                _logger.LogWarning("Login: Username or password is missing. \nUsername: {Username}, Password: {Password}", request?.Username, request?.Password);
                return BadRequest("Benutzername und Passwort sind erforderlich.");
            }

            _logger.LogInformation("Versuche, Benutzer zu authentifizieren: {Username}", request.Username);
            var user = await _userService.AuthenticateAsync(request.Username, request.Password);

            if (user != null)
            {
                _logger.LogInformation("Login erfolgreich für Benutzer: {Username}", request.Username);
                return Ok(new { message = "Login erfolgreich.", redirectUrl = "html/HomeScreen.html",userData = new{id=user.ID, username = user.Username, role = user.Role} }); 
            }
            else
            {
                _logger.LogWarning("Ungültige Anmeldeinformationen für Benutzer: {Username}", request.Username);
                return Unauthorized(new { message = "Ungültiger Benutzername oder Passwort." }); 
            }
        }
    }
}
