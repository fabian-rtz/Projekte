namespace KinoTicketSystem.Models
{
    public class CancelReservationRequest
    {
        public int SeatId { get; set; }
        public int? UserId { get; set; }
    }
}