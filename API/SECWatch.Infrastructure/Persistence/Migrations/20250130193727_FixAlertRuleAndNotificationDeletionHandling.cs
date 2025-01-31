using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixAlertRuleAndNotificationDeletionHandling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertNotifications_AlertRules_AlertRuleId",
                table: "AlertNotifications");

            migrationBuilder.AlterColumn<Guid>(
                name: "AlertRuleId",
                table: "AlertNotifications",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_AlertNotifications_AlertRules_AlertRuleId",
                table: "AlertNotifications",
                column: "AlertRuleId",
                principalTable: "AlertRules",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AlertNotifications_AlertRules_AlertRuleId",
                table: "AlertNotifications");

            migrationBuilder.AlterColumn<Guid>(
                name: "AlertRuleId",
                table: "AlertNotifications",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AlertNotifications_AlertRules_AlertRuleId",
                table: "AlertNotifications",
                column: "AlertRuleId",
                principalTable: "AlertRules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
