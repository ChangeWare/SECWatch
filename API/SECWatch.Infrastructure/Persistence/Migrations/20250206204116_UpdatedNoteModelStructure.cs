using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedNoteModelStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NoteSubject");

            migrationBuilder.AddColumn<string>(
                name: "AccessionNumber",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Cik",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FiscalPeriod",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FiscalYear",
                table: "Notes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Form",
                table: "Notes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NoteType",
                table: "Notes",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AccessionNumber",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Cik",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "FiscalPeriod",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "FiscalYear",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "Form",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "NoteType",
                table: "Notes");

            migrationBuilder.CreateTable(
                name: "NoteSubject",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccessionNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Cik = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
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
    }
}
