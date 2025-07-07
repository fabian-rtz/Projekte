using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KinoTicketSystem.Migrations
{
    /// <inheritdoc />
    public partial class AddReservedByUserToSeats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReservedByUserId",
                table: "Seats",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Seats_ReservedByUserId",
                table: "Seats",
                column: "ReservedByUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Seats_Users_ReservedByUserId",
                table: "Seats",
                column: "ReservedByUserId",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Seats_Users_ReservedByUserId",
                table: "Seats");

            migrationBuilder.DropIndex(
                name: "IX_Seats_ReservedByUserId",
                table: "Seats");

            migrationBuilder.DropColumn(
                name: "ReservedByUserId",
                table: "Seats");
        }
    }
}
