using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace KinoTicketSystem.Models
{
    public class Show
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Fix für AutoIncrement
        public int ID { get; set; }

        public int   MovieId { get; set; }
        
        [JsonIgnore]
        public Movie Movie   { get; set; } = null!;

        public int  HallId { get; set; }
        public Hall Hall   { get; set; } = null!;

        public TimeSpan Time { get; set; } = TimeSpan.Zero;
        public DateTime Date { get; set; } = DateTime.MinValue.Date;
    }
}