using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Company_Project.Migrations
{
    public partial class addDesignationIdinEmployeeDesignation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "DesignationId",
                table: "employeeDesignations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_employeeDesignations_DesignationId",
                table: "employeeDesignations",
                column: "DesignationId");

            migrationBuilder.AddForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations",
                column: "DesignationId",
                principalTable: "Designations",
                principalColumn: "DesignationId",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_employeeDesignations_Designations_DesignationId",
                table: "employeeDesignations");

            migrationBuilder.DropIndex(
                name: "IX_employeeDesignations_DesignationId",
                table: "employeeDesignations");

            migrationBuilder.DropColumn(
                name: "DesignationId",
                table: "employeeDesignations");
        }
    }
}
