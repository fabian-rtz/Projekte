using KinoTicketSystem.DB;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KinoTicketSystem.Controllers
{

    [ApiController]
    [Route("api/halls")]
    public class HallController : ControllerBase
    {

        private readonly ApplicationDbContext _dbContext;

        public HallController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllHalls()
        {
            var halls = await _dbContext.Halls
                            .Select(h => new 
                            {
                                h.ID,
                                h.Name
                            })
                            .ToListAsync();

            return Ok(halls);
        }

    }

}
