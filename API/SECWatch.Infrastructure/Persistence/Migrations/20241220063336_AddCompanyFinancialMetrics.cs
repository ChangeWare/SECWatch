using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyFinancialMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CIK",
                table: "Companies",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_Companies_CIK",
                table: "Companies",
                column: "CIK");

            migrationBuilder.CreateTable(
                name: "CompanyFinancialMetrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    FirstReported = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastReported = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Metric = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CompanyCIK = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyFinancialMetrics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyFinancialMetrics_Companies_CompanyCIK",
                        column: x => x.CompanyCIK,
                        principalTable: "Companies",
                        principalColumn: "CIK",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyFinancialMetrics_CompanyCIK",
                table: "CompanyFinancialMetrics",
                column: "CompanyCIK");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyFinancialMetrics");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_Companies_CIK",
                table: "Companies");

            migrationBuilder.AlterColumn<string>(
                name: "CIK",
                table: "Companies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");
        }
    }
}
