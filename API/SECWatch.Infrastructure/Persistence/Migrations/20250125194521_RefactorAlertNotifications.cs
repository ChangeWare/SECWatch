using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorAlertNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FilingAlertNotifications");

            migrationBuilder.CreateTable(
                name: "AlertNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AlertRuleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyCik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventType = table.Column<int>(type: "int", nullable: false),
                    FormType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    AccessionNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    FilingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsViewed = table.Column<bool>(type: "bit", nullable: false),
                    IsEmailSent = table.Column<bool>(type: "bit", nullable: false),
                    IsDismissed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlertNotifications_AlertRules_AlertRuleId",
                        column: x => x.AlertRuleId,
                        principalTable: "AlertRules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AlertNotifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AlertNotifications_AlertRuleId",
                table: "AlertNotifications",
                column: "AlertRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_AlertNotifications_UserId",
                table: "AlertNotifications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlertNotifications");

            migrationBuilder.CreateTable(
                name: "FilingAlertNotifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AlertRuleId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AccessionNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CompanyCik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EventType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FilingDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FormType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsDismissed = table.Column<bool>(type: "bit", nullable: false),
                    IsEmailSent = table.Column<bool>(type: "bit", nullable: false),
                    IsViewed = table.Column<bool>(type: "bit", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilingAlertNotifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FilingAlertNotifications_AlertRules_AlertRuleId",
                        column: x => x.AlertRuleId,
                        principalTable: "AlertRules",
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
                name: "IX_FilingAlertNotifications_AlertRuleId",
                table: "FilingAlertNotifications",
                column: "AlertRuleId");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertNotifications_UserId",
                table: "FilingAlertNotifications",
                column: "UserId");
        }
    }
}
