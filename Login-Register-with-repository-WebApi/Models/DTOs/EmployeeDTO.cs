using Microsoft.AspNetCore.Mvc.Rendering;
using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models.DTOs
{
    public class EmployeeDTO
    {
        [Key]
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string EmployeeAddress { get; set; }
        public string Employee_Pancard_Number { get; set; }
        public int Employee_Account_Number { get; set; }
        public int Employee_PF_Number { get; set; }
        public int? CompanyId { get; set; }
        public string? ApplicationUserId { get; set; }
        ///
        //public IEnumerable<SelectListItem>? CompanyList { get; set; }
        // public IEnumerable<SelectListItem>? RoleList { get; set; }

        //**
        //[Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

       // [EmailAddress]
        //[Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

       // [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        //[Required(ErrorMessage = "Role is required")]
        public string? Role { get; set; }


    }
}
