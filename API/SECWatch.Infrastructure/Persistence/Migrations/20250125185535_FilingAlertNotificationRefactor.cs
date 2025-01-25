using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FilingAlertNotificationRefactor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications");

            migrationBuilder.RenameColumn(
                name: "FilingAlertRuleId",
                table: "FilingAlertNotifications",
                newName: "AlertRuleId");

            migrationBuilder.RenameIndex(
                name: "IX_FilingAlertNotifications_FilingAlertRuleId",
                table: "FilingAlertNotifications",
                newName: "IX_FilingAlertNotifications_AlertRuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_AlertRuleId",
                table: "FilingAlertNotifications",
                column: "AlertRuleId",
                principalTable: "AlertRules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_AlertRuleId",
                table: "FilingAlertNotifications");

            migrationBuilder.RenameColumn(
                name: "AlertRuleId",
                table: "FilingAlertNotifications",
                newName: "FilingAlertRuleId");

            migrationBuilder.RenameIndex(
                name: "IX_FilingAlertNotifications_AlertRuleId",
                table: "FilingAlertNotifications",
                newName: "IX_FilingAlertNotifications_FilingAlertRuleId");

            migrationBuilder.AddForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications",
                column: "FilingAlertRuleId",
                principalTable: "AlertRules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
