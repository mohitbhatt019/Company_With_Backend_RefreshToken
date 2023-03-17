using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Company_Project.Migrations
{
    public partial class EmployeeDesignationTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "employeeDesignations",
                columns: table => new
                {
                    EmployeeDesignationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_employeeDesignations", x => x.EmployeeDesignationId);
                    table.ForeignKey(
                        name: "FK_employeeDesignations_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_employeeDesignations_EmployeeId",
                table: "employeeDesignations",
                column: "EmployeeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "employeeDesignations");
        }
    }
}
