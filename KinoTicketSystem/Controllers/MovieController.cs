using System.Text.Json;

using KinoTicketSystem.DB;
using KinoTicketSystem.Models;
using KinoTicketSystem.Models.DTO;

using Microsoft.EntityFrameworkCore;

using Microsoft.AspNetCore.Mvc;

namespace KinoTicketSystem.Controllers
{
    [ApiController]
    [Route("api/movies")]
    public class MovieController : ControllerBase
    {
        private readonly ApplicationDbContext _dbcontext;

        public MovieController(ApplicationDbContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        [HttpPost]
        public async Task<IActionResult> CreateMovie([FromBody] MovieDTO movieDto)
        {
            if (movieDto == null)
            {
                return BadRequest("Keine gültigen Filmdaten empfangen.");
            }

            // Movie-Entity aus DTO bauen
            var movie = new Movie
            {
                Title    = movieDto.Title,
                Image    = movieDto.Image,
                Genre    = movieDto.Genre,
                Fsk      = movieDto.Fsk,
                Duration = movieDto.Duration
            };

            //  Erst speichern, damit Movie eine ID bekommt
            _dbcontext.Movies.Add(movie);
            await _dbcontext.SaveChangesAsync();

            // Falls Shows existieren, Shows mit MovieId anlegen
            if (movieDto.Shows != null && movieDto.Shows.Any())
            {
                var shows = movieDto.Shows.Select(showDto => new Show
                {
                    Date    = showDto.Date,
                    Time    = showDto.Time,
                    HallId  = showDto.HallId,
                    MovieId = movie.ID // Setzen des Foreign Key
                }).ToList();

                _dbcontext.Shows.AddRange(shows);
                await _dbcontext.SaveChangesAsync();
            }

            return CreatedAtAction(nameof(CreateMovie), new { id = movie.ID }, movie);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieDTO movieDto)
        {
            var existingMovie = await _dbcontext.Movies
                .Include(m => m.Shows) // Lade die Shows mit
                .FirstOrDefaultAsync(m => m.ID == id);

            if (existingMovie == null)
            {
                return NotFound("Film nicht gefunden.");
            }

            // 🔹 Film-Daten aktualisieren
            existingMovie.Title = movieDto.Title;
            existingMovie.Genre = movieDto.Genre;
            existingMovie.Fsk = movieDto.Fsk;
            existingMovie.Duration = movieDto.Duration;
            existingMovie.Image = movieDto.Image;

            // 🔹 Shows aktualisieren
            if (movieDto.Shows != null)
            {
                // Bestehende Shows löschen (sofern sie nicht mehr existieren sollen)
                _dbcontext.Shows.RemoveRange(existingMovie.Shows);

                // Neue Shows speichern
                var newShows = movieDto.Shows.Select(showDto => new Show
                {
                    Date = showDto.Date,
                    Time = showDto.Time,
                    HallId = showDto.HallId,
                    MovieId = existingMovie.ID
                }).ToList();

                _dbcontext.Shows.AddRange(newShows);
            }

            // 🔹 Änderungen speichern
            await _dbcontext.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _dbcontext.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound("Film nicht gefunden.");
            }
            _dbcontext.Movies.Remove(movie);
            await _dbcontext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMovies()
        {
            var movies = await _dbcontext.Movies
                             .Include(m => m.Shows)
                             .Select(m => new MovieDTO
                             {
                                 ID       = m.ID, 
                                 Title    = m.Title,
                                 Image    = m.Image,
                                 Duration = m.Duration,
                                 Fsk      = m.Fsk,
                                 Genre    = m.Genre,
                                 Shows = m.Shows.Select(s => new ShowDTO
                                 {
                                     ID     = s.ID,  // Füge die Show-ID hinzu
                                     Date   = s.Date,
                                     Time   = s.Time,
                                     HallId = s.HallId
                                 }).ToList()
                             })
                             .ToListAsync();

            return Ok(movies);
        }

        [HttpGet("{id}")] // Route: /api/movies/{id}
        public async Task<IActionResult> GetMovieById(int id)
        {
            // Suche den Film anhand der ID in der Datenbank
            var movie = await _dbcontext.Movies
                            .Include(m => m.Shows) // Lade die zugehörigen Shows
                            .FirstOrDefaultAsync(m => m.ID == id);

            // Wenn der Film nicht gefunden wurde, gib einen 404-Fehler zurück
            if (movie == null)
            {
                return NotFound("Film nicht gefunden.");
            }

            // Konvertiere das Movie-Objekt in ein MovieDTO
            var movieDto = new MovieDTO
            {
                ID       = movie.ID, // Füge die Movie-ID hinzu
                Title    = movie.Title,
                Image    = movie.Image,
                Duration = movie.Duration,
                Fsk      = movie.Fsk,
                Genre    = movie.Genre,
                Shows    = movie.Shows.Select(s => new ShowDTO
                {
                    ID     = s.ID,  // Füge die Show-ID hinzu
                    Date   = s.Date,
                    Time   = s.Time,
                    HallId = s.HallId
                }).ToList()
            };

            // Gib den Film als Antwort zurück
            return Ok(movieDto);
        }
    }
}
