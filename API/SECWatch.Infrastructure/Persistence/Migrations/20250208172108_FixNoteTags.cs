using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SECWatch.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class FixNoteTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "Tags",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Tags_UserId",
                table: "Tags",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Users_UserId",
                table: "Tags",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Users_UserId",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_Tags_UserId",
                table: "Tags");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Tags");
        }
    }
}
