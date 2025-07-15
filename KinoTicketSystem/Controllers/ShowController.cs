using KinoTicketSystem.DB;
using KinoTicketSystem.Models;
using KinoTicketSystem.Models.DTO;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KinoTicketSystem.Controllers
{

    [ApiController]
    [Route("api/shows")]
    public class ShowController : ControllerBase
    {

        private readonly ApplicationDbContext _dbContext;

        public ShowController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        //Liste aller Shows
        [HttpGet]
        public async Task<IActionResult> GetAllShows()
        {
            var shows = await _dbContext.Shows
                            .Select(
                                s => new
                                {
                                    s.ID,
                                    s.Date,
                                    s.Time,
                                    MovieTitle = s.Movie.Title,
                                    HallName   = s.Hall.Name
                                }
                            )
                            .ToListAsync();

            return Ok(shows);
        }

        //Erstellen einer neuen Show
        [HttpPost]
        public async Task<IActionResult> CreateShow([FromBody] ShowDTO showDto)
        {
            if (showDto == null || showDto.HallId <= 0)
            {
                return BadRequest(new { message = "Ungültige Daten für die Show-Erstellung." });
            }

            var show = new Show
            {
                Date   = showDto.Date,
                Time   = showDto.Time,
                HallId = showDto.HallId
            };

            _dbContext.Shows.Add(show);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(CreateShow), new { id = show.ID }, show);
        }

    }

}
