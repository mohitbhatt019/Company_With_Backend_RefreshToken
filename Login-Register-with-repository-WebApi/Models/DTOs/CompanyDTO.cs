using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models.DTO
{
    public class CompanyDTO
    {
        [Key]
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddress { get; set; }
        public string CompanyGST { get; set; }
        public string? ApplicationUserId { get; set; }

    }
}
