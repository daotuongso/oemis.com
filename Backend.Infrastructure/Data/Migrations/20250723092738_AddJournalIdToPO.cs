using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddJournalIdToPO : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "JournalId",
                table: "PurchaseOrders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PurchaseOrders_JournalId",
                table: "PurchaseOrders",
                column: "JournalId");

            migrationBuilder.AddForeignKey(
                name: "FK_PurchaseOrders_Journals_JournalId",
                table: "PurchaseOrders",
                column: "JournalId",
                principalTable: "Journals",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PurchaseOrders_Journals_JournalId",
                table: "PurchaseOrders");

            migrationBuilder.DropIndex(
                name: "IX_PurchaseOrders_JournalId",
                table: "PurchaseOrders");

            migrationBuilder.DropColumn(
                name: "JournalId",
                table: "PurchaseOrders");
        }
    }
}
