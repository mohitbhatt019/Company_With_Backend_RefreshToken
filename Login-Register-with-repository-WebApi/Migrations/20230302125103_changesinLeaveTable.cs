using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Company_Project.Migrations
{
    public partial class changesinLeaveTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Leaves",
                newName: "Reason");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Reason",
                table: "Leaves",
                newName: "Status");
        }
    }
}
