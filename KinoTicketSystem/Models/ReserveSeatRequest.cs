namespace KinoTicketSystem.Models
{
    public class ReserveSeatRequest
    {
        public int SeatId { get; set; }
        public bool IsTemporary { get; set; } 
        public int? UserId { get; set; } 
    }
}
