using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models.DTOs
{
    public class EmployeeDesignationDTO
    {
        [Key]
        public int EmployeeDesignationId { get; set; }
        public int? EmployeeId { get; set; }
        public int DesignationId { get; set; }
        public string? DesignationNAme { get; set; }

    }
}
