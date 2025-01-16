using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Domain.Features.Users.Models.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFinancialMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyFinancialMetrics");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CompanyFinancialMetrics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CompanyCIK = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstReported = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastReported = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Metric = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
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
    }
}
