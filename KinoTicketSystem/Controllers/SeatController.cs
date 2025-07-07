using KinoTicketSystem.DB;
using KinoTicketSystem.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KinoTicketSystem.Controllers
{
    [ApiController]
    [Route("api/seats")]
    public class SeatController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly int _tempReservationSeconds;

        public SeatController(ApplicationDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            // Reservierungsdauer aus Konfig (appsettings.json) laden
            _tempReservationSeconds = configuration.GetValue<int>("ReservationSettings:TemporaryReservationDuration");

                // Debugging-Ausgabe zur Überprüfung
            Console.WriteLine($"🔹 Geladene Reservierungsdauer: {_tempReservationSeconds} Sekunden");

            if (_tempReservationSeconds == 0)
            {
                Console.WriteLine("⚠️ ACHTUNG: Die Reservierungsdauer ist 0! Überprüfe appsettings.json oder appsettings.Development.json.");
            }
        }

        [HttpPost("reserve")]
        public async Task<IActionResult> ReserveSeat([FromBody] ReserveSeatRequest request)
        {
            // Prüft: Ist UserId gesetzt?
            if (!request.UserId.HasValue)
            {
                return BadRequest(new { message = "UserId fehlt" });
            }

            // Transaktion wird gestartet
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                // 1) Existiert der User überhaupt?
                var userExists = await _dbContext.Users.AnyAsync(u => u.ID == request.UserId.Value);
                if (!userExists)
                {
                    return BadRequest(new { message = "Benutzer nicht gefunden." });
                }

                // 2) Wenn ja, Sitz laden
                var seat = await _dbContext.Seats
                    .SingleOrDefaultAsync(s => s.ID == request.SeatId);

                if (seat == null)
                {
                    return NotFound(new { message = "Sitz nicht gefunden." });
                }

                // 3) Prüft, ob eine evtl. vorhandene Reservierung abgelaufen ist
                if (seat.Status == Seat.SeatStatus.reserviert 
                    && seat.ReservedUntil.HasValue 
                    && seat.ReservedUntil.Value < DateTime.UtcNow)
                {
                    // Reservierung ist abgelaufen => Sitz wird freigegeben
                    seat.Status = Seat.SeatStatus.frei;
                    seat.ReservedUntil = null;
                    seat.ReservedByUserId = null;
                }

                // 4) Falls der Sitz noch nicht frei ist, wird geprüft, ob er vom aktuellen User reserviert wurde
                if (seat.Status != Seat.SeatStatus.frei)
                {
                    // Wenn der Sitz nicht frei und nicht vom gleichen User ist => Fehlermeldung
                    if (seat.ReservedByUserId != request.UserId.Value)
                    {
                        return Conflict(new { message = "Sitz ist bereits von einem anderen Benutzer reserviert oder gebucht." });
                    }

                    // Wenn der gleiche User den Sitz bereits reserviert hat und jetzt auf dauerhaft buchen wechselt
                    if (!request.IsTemporary && seat.Status == Seat.SeatStatus.reserviert)
                    {
                        seat.Status = Seat.SeatStatus.gebucht;
                        seat.ReservedUntil = null;
                        await _dbContext.SaveChangesAsync(); // optionales Teilspeichern
                        await transaction.CommitAsync();

                        return Ok(new { message = "Sitz erfolgreich dauerhaft gebucht." });
                    }

                    // Wenn der gleiche User versucht, erneut temporär zu reservieren
                    if (request.IsTemporary && seat.Status == Seat.SeatStatus.reserviert)
                    {
                        return BadRequest(new { message = "Sitz ist bereits temporär reserviert." });
                    }

                    // Falls der Sitz schon gebucht ist
                    if (seat.Status == Seat.SeatStatus.gebucht)
                    {
                        return Conflict(new { message = "Sitz ist bereits dauerhaft gebucht." });
                    }
                }

                // 5) Neue Reservierung durchführen
                if (request.IsTemporary)
                {
                    seat.Status = Seat.SeatStatus.reserviert;
                    seat.ReservedUntil = DateTime.UtcNow.AddSeconds(_tempReservationSeconds);
                    seat.ReservedByUserId = request.UserId.Value;
                }
                else
                {
                    seat.Status = Seat.SeatStatus.gebucht;
                    seat.ReservedUntil = null; // Dauerhafte Buchung
                    seat.ReservedByUserId = request.UserId.Value;
                }

                // 6) Änderungen speichern
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                var msg = request.IsTemporary 
                    ? $"Sitz für {_tempReservationSeconds} Sekunden reserviert."
                    : "Sitz dauerhaft gebucht.";

                return Ok(new { message = msg });
            }
            catch (DbUpdateConcurrencyException)
            {
                await transaction.RollbackAsync();
                return Conflict(new { message = "Der Sitz wurde in der Zwischenzeit von einem anderen Benutzer geändert. Bitte aktualisieren und erneut versuchen." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetSeats([FromQuery] int hallId)
        {
            var seats = await _dbContext.Seats
                .Where(s => s.HallId == hallId)
                .ToListAsync();

            foreach (var seat in seats)
            {
                if (seat.ReservedUntil != null && seat.ReservedUntil < DateTime.UtcNow)
                {
                    seat.Status = Seat.SeatStatus.frei;
                    seat.ReservedUntil = null;
                }
            }

            await _dbContext.SaveChangesAsync(); // Änderungen in die Datenbank übernehmen

            return Ok(seats);
        }
        [HttpPost("cancelReservation")]
        public async Task<IActionResult> CancelReservation([FromBody] CancelReservationRequest request)
        {
            if (!request.UserId.HasValue)
            {
                return BadRequest(new { message = "UserId fehlt" });
            }

            var seat = await _dbContext.Seats.SingleOrDefaultAsync(s => s.ID == request.SeatId);
            if (seat == null)
            {
                return NotFound(new { message = "Sitz nicht gefunden." });
            }

            // Prüfe, ob der Sitz vom anfragenden Benutzer reserviert ist
            if (seat.ReservedByUserId != request.UserId.Value)
            {
                return Forbid();
            }

            // Setze den Sitz wieder auf "frei"
            seat.Status = Seat.SeatStatus.frei;
            seat.ReservedUntil = null;
            seat.ReservedByUserId = null;

            await _dbContext.SaveChangesAsync();
            return Ok(new { message = "Reservierung erfolgreich aufgehoben." });
        }
    }
}