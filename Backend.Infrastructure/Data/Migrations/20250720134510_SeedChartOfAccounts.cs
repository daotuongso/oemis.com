using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Backend.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedChartOfAccounts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Accounts",
                columns: new[] { "Id", "Code", "Name", "ParentId", "Type" },
                values: new object[,]
                {
                    { 1, "111", "Tiền mặt", null, 0 },
                    { 2, "112", "Tiền gửi NH", null, 0 },
                    { 3, "152", "Hàng tồn kho", null, 0 },
                    { 4, "211", "TSCĐ hữu hình", null, 0 },
                    { 5, "214", "Hao mòn lũy kế", null, 0 },
                    { 6, "331", "Phải trả NCC", null, 1 },
                    { 7, "333", "Thuế phải nộp", null, 1 },
                    { 8, "341", "Vay dài hạn", null, 1 },
                    { 9, "411", "Vốn chủ sở hữu", null, 2 },
                    { 10, "421", "LN chưa PP", null, 2 },
                    { 11, "511", "Doanh thu bán", null, 3 },
                    { 12, "515", "Doanh thu DV", null, 3 },
                    { 13, "611", "Giá vốn hàng", null, 4 },
                    { 14, "621", "Lương", null, 4 },
                    { 15, "622", "Thuê VP", null, 4 },
                    { 16, "623", "Điện nước", null, 4 },
                    { 17, "627", "Quảng cáo", null, 4 },
                    { 18, "629", "Chi phí khác", null, 4 },
                    { 19, "631", "Khấu hao", null, 4 },
                    { 20, "635", "Chi phí lãi vay", null, 4 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Accounts",
                keyColumn: "Id",
                keyValue: 20);
        }
    }
}
