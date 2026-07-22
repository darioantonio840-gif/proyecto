using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POSApp.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSeedUsernames : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$GhFj8y77sS0i1PvO70.ECuCLHB5GR8irnaMcrPf2qS80W2XgA6no6", "antonio" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$x8QYmEktwnLjMSblrJ4lCercWJ.KajTnuTBLfetkc6uADVbtbWYom", "juan" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$BZsyBFzAYr7Ckd0vr.S15u5pACvm1HgarIX6vOkXNwxxAQAU6wU1C", "dueno" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "PasswordHash", "Username" },
                values: new object[] { "$2a$11$BC7Zw5bMg9IoT49p5jS/duk86C4Zkx9jIX4Q37SQUKkhG4GatOiTy", "empleado" });
        }
    }
}
