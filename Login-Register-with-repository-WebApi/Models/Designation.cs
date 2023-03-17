using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models
{
    public class Designation
    {
        [Key]
        public int DesignationId { get; set; }
        public string Name { get; set; }

        

    }
}
