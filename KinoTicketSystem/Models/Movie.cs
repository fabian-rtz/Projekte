using System.Text.Json.Serialization;

namespace KinoTicketSystem.Models
{
   public class Movie
    {
        public int ID { get; set; }

        public string Image { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty; 
        public string Genre { get; set; } = string.Empty;
        public string Fsk { get; set; } = string.Empty;

        public int Duration { get; set; }

        [JsonIgnore]
        public ICollection<Show> Shows { get; set; } = new List<Show>();

    }
}
