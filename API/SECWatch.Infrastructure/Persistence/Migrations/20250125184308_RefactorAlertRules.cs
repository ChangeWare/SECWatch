using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RefactorAlertRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AlertRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastTriggeredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    _formTypes = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertRules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlertRules_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlertRules_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.Sql(@"
                INSERT INTO AlertRules (Id, UserId, CompanyId, Type, Name, Description, IsEnabled, CreatedAt, LastTriggeredAt, _formTypes)
                SELECT Id, UserId, CompanyId, 0, Name, Description, IsEnabled, CreatedAt, LastTriggeredAt, _formTypes 
                FROM FilingAlertRules");

            migrationBuilder.CreateIndex(
                name: "IX_AlertRules_CompanyId",
                table: "AlertRules",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_AlertRules_Type_UserId",
                table: "AlertRules",
                columns: new[] { "Type", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_AlertRules_UserId",
                table: "AlertRules",
                column: "UserId");

            migrationBuilder.DropForeignKey(
                name: "FK_FilingAlertNotifications_FilingAlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications");

            migrationBuilder.AddForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications",
                column: "FilingAlertRuleId",
                principalTable: "AlertRules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.DropTable(
                name: "FilingAlertRules");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FilingAlertRules",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LastTriggeredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
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

            migrationBuilder.Sql(@"
                INSERT INTO FilingAlertRules (Id, UserId, CompanyId, Name, Description, IsEnabled, CreatedAt, LastTriggeredAt, _formTypes)
                SELECT Id, UserId, CompanyId, Name, Description, IsEnabled, CreatedAt, LastTriggeredAt, _formTypes 
                FROM AlertRules WHERE Type = 0");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertRules_CompanyId",
                table: "FilingAlertRules",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_FilingAlertRules_UserId",
                table: "FilingAlertRules",
                column: "UserId");

            migrationBuilder.DropForeignKey(
                name: "FK_FilingAlertNotifications_AlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications");

            migrationBuilder.AddForeignKey(
                name: "FK_FilingAlertNotifications_FilingAlertRules_FilingAlertRuleId",
                table: "FilingAlertNotifications",
                column: "FilingAlertRuleId",
                principalTable: "FilingAlertRules",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.DropTable(
                name: "AlertRules");
        }
    }
}