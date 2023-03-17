using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Company_Project.Migrations
{
    public partial class allownull2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations");

            migrationBuilder.DropForeignKey(
                name: "FK_employeeDesignations_Employees_EmployeeId",
                table: "employeeDesignations");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Companies_CompanyId",
                table: "Employees");

       

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Employees",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "employeeDesignations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "DesignationId",
                table: "employeeDesignations",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "EmployeeId",
                table: "Designations",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Designations_EmployeeId",
                table: "Designations",
                column: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Designations_Employees_EmployeeId",
                table: "Designations",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations",
                column: "DesignationId",
                principalTable: "Designations",
                principalColumn: "DesignationId");

            migrationBuilder.AddForeignKey(
                name: "FK_employeeDesignations_Employees_EmployeeId",
                table: "employeeDesignations",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Companies_CompanyId",
                table: "Employees",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "CompanyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Designations_Employees_EmployeeId",
                table: "Designations");

            migrationBuilder.DropForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations");

            migrationBuilder.DropForeignKey(
                name: "FK_employeeDesignations_Employees_EmployeeId",
                table: "employeeDesignations");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Companies_CompanyId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Designations_EmployeeId",
                table: "Designations");

            migrationBuilder.DropColumn(
                name: "EmployeeId",
                table: "Designations");

            migrationBuilder.AlterColumn<int>(
                name: "CompanyId",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                table: "employeeDesignations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "DesignationId",
                table: "employeeDesignations",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "DesignationEmployee",
                columns: table => new
                {
                    Employee_DesignationsDesignationId = table.Column<int>(type: "int", nullable: false),
                    EmployeesEmployeeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DesignationEmployee", x => new { x.Employee_DesignationsDesignationId, x.EmployeesEmployeeId });
                    table.ForeignKey(
                        name: "FK_DesignationEmployee_Designations_Employee_DesignationsDesignationId",
                        column: x => x.Employee_DesignationsDesignationId,
                        principalTable: "Designations",
                        principalColumn: "DesignationId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DesignationEmployee_Employees_EmployeesEmployeeId",
                        column: x => x.EmployeesEmployeeId,
                        principalTable: "Employees",
                        principalColumn: "EmployeeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DesignationEmployee_EmployeesEmployeeId",
                table: "DesignationEmployee",
                column: "EmployeesEmployeeId");

            migrationBuilder.AddForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations",
                column: "DesignationId",
                principalTable: "Designations",
                principalColumn: "DesignationId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_employeeDesignations_Employees_EmployeeId",
                table: "employeeDesignations",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "EmployeeId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Companies_CompanyId",
                table: "Employees",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "CompanyId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
