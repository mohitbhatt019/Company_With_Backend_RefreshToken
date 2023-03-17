using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models.DTOs
{
    public class DesignationDTO
    {
        [Key]
        public int DesignationId { get; set; }
        public string Name { get; set; }
    }
}
