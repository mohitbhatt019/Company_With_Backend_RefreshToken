using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models
{
    public class Leave
    {
        [Key]
        public int LeaveId { get; set; }
        public int EmployeeId { get; set; }
        public Employee Employee { get; set; }
        public LeaveStatus LeaveStatus { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Reason { get; set; }

    }
}
