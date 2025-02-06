using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFilingFiscalYearAndPeriodFromNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FiscalPeriod",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "FiscalYear",
                table: "Notes");

            migrationBuilder.AddColumn<DateTime>(
                name: "FilingDate",
                table: "Notes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "FilingReportDate",
                table: "Notes",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilingDate",
                table: "Notes");

            migrationBuilder.DropColumn(
                name: "FilingReportDate",
                table: "Notes");

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
        }
    }
}
