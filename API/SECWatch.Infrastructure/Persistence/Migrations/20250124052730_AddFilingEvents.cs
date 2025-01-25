using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddFilingEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FilingAlertRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastTriggeredAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    _formTypes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilingAlertRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FilingAlertRules_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FilingAlertRules_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FilingAlertNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FilingAlertRuleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyCik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FormType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FilingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsViewed = table.Column<bool>(type: "bit", nullable: false),
                    IsEmailSent = table.Column<bool>(type: "bit", nullable: false),
                    IsDismissed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilingAlertNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FilingAlertNotifications_FilingAlertRules_FilingAlertRuleId",
                        column: x => x.FilingAlertRuleId,
                        principalTable: "FilingAlertRules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FilingAlertNotifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertNotifications_FilingAlertRuleId",
                table: "FilingAlertNotifications",
                column: "FilingAlertRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertNotifications_UserId",
                table: "FilingAlertNotifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertRules_CompanyId",
                table: "FilingAlertRules",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertRules_UserId",
                table: "FilingAlertRules",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FilingAlertNotifications");

            migrationBuilder.DropTable(
                name: "FilingAlertRules");
        }
    }
}
