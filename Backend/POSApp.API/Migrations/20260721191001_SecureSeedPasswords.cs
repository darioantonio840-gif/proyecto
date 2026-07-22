using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POSApp.API.Migrations
{
    /// <inheritdoc />
    public partial class SecureSeedPasswords : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$BZsyBFzAYr7Ckd0vr.S15u5pACvm1HgarIX6vOkXNwxxAQAU6wU1C");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$BC7Zw5bMg9IoT49p5jS/duk86C4Zkx9jIX4Q37SQUKkhG4GatOiTy");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "$2a$11$8ZvMmAwvYtC2CQT5J.g4veuwT/zskfNrqwEz8ghQ9Ddu4WQ02Grm2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "admin123");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "emp123");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 3,
                column: "PasswordHash",
                value: "superadmin");
        }
    }
}
