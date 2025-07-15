namespace KinoTicketSystem.Models.DTO
{
    public class MovieDTO
    {
        public int            ID      { get; set; } 
        public string        Title    { get; set; } = string.Empty;
        public string        Image    { get; set; } = string.Empty;
        public string        Genre    { get; set; } = string.Empty;
        public string        Fsk      { get; set; } = string.Empty;
        public int           Duration { get; set; }
        public List<ShowDTO> Shows    { get; set; } = new(); 
    }
}
