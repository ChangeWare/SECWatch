using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Domain.Features.Users.Models.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropUniqueConstraint(
                name: "AK_Companies_CIK",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "CIK",
                table: "Companies",
                newName: "Cik");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Companies_Cik",
                table: "Companies",
                column: "Cik");

            migrationBuilder.CreateTable(
                name: "Notes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", maxLength: 10000, nullable: false),
                    SelectionData = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Color = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NoteSubject",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Cik = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    AccessionNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NoteSubject", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NoteSubject_Notes_Id",
                        column: x => x.Id,
                        principalTable: "Notes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteSubject");

            migrationBuilder.DropTable(
                name: "Notes");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Companies_Cik",
                table: "Companies");

            migrationBuilder.RenameColumn(
                name: "Cik",
                table: "Companies",
                newName: "CIK");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Companies_CIK",
                table: "Companies",
                column: "CIK");
        }
    }
}
