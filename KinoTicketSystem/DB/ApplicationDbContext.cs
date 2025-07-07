using KinoTicketSystem.Models;
using Microsoft.EntityFrameworkCore;

namespace KinoTicketSystem.DB
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Hall> Halls { get; set; } = null!;
        public DbSet<Movie> Movies { get; set; } = null!;
        public DbSet<Seat> Seats { get; set; } = null!;
        public DbSet<Show> Shows { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // SEAT-Konfiguration
            builder.Entity<Seat>(entity =>
            {
                // Standardwert für Status
                entity.Property(s => s.Status)
                      .HasDefaultValue(Seat.SeatStatus.frei);

                // Beziehung zu Hall
                entity.HasOne(s => s.Hall)
                      .WithMany(h => h.Seats)
                      .HasForeignKey(s => s.HallId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Beziehung zu User
                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(s => s.ReservedByUserId)
                      .OnDelete(DeleteBehavior.SetNull);

                // NEU! -> RowVersion für Optimistic Concurrency
                entity.Property(s => s.RowVersion)
                      .IsRowVersion();
            });

            // SHOW-Konfiguration 
            builder.Entity<Show>(entity =>
            {
                entity.HasOne(s => s.Movie)
                      .WithMany(m => m.Shows)
                      .HasForeignKey(s => s.MovieId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(s => s.Hall)
                      .WithMany()
                      .HasForeignKey(s => s.HallId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // USER-Konfiguration 
            builder.Entity<User>(entity =>
            {
                entity.Property(u => u.Username)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(u => u.Password)
                      .IsRequired();

                entity.Property(u => u.Role)
                      .IsRequired()
                      .HasMaxLength(50);
            });
        }
    }
}