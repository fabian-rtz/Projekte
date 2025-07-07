namespace KinoTicketSystem.Models
{
    public class Hall
    {
        public int ID { get; set; }
        public string Name { get; set; } = string.Empty; 
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}