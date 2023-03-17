using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeAddress { get; set; }
        public string Employee_Pancard_Number { get; set; }
        public int Employee_Account_Number { get; set; }
        public int Employee_PF_Number { get; set; }
        public int? CompanyId { get; set; }
        public Company? Company { get; set; }
        public string? ApplicationUserId { get; set; }
        public ApplicationUser? ApplicationUser { get; set; }
        public string Role { get; set; }

        ///
        public List<EmployeeDesignation>? EmployeeDesignations { get; set; }


    }
}
