using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyUserDashboardPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompanyUserDashboardPreferences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PinnedConcepts = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyUserDashboardPreferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyUserDashboardPreferences_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyUserDashboardPreferences_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUserDashboardPreferences_CompanyId_UserId",
                table: "CompanyUserDashboardPreferences",
                columns: new[] { "CompanyId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyUserDashboardPreferences_UserId",
                table: "CompanyUserDashboardPreferences",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyUserDashboardPreferences");
        }
    }
}
