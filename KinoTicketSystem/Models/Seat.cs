using System;

namespace KinoTicketSystem.Models
{
    public class Seat
    {
        public int    ID         { get; set; }
        public int    HallId     { get; set; }
        public Hall   Hall       { get; set; } = null!;
        public string Row        { get; set; } = string.Empty;
        public int    SeatNumber { get; set; } = 0;
        public SeatStatus Status { get; set; } = SeatStatus.frei;
        public DateTime? ReservedUntil { get; set; }
        public int? ReservedByUserId { get; set; }
        public byte[]? RowVersion { get; set; }
        public enum SeatStatus
        {
            frei = 0,
            gebucht = 1,
            reserviert = 2

        }
    }
}