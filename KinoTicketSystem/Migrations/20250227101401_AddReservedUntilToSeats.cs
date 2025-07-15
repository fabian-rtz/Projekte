using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KinoTicketSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddReservedUntilToSeats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReservedUntil",
                table: "Seats",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReservedUntil",
                table: "Seats");
        }
    }
}
