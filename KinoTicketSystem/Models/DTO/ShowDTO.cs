namespace KinoTicketSystem.Models.DTO
{
    public class ShowDTO
    {
        public int ID     { get; set; } 
        public DateTime Date   { get; set; }
        public TimeSpan Time   { get; set; }
        public int HallId { get; set; }  
    }
}
