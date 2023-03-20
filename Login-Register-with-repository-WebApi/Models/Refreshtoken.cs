using System.ComponentModel.DataAnnotations;

namespace Company_Project.Models
{
    public class Refreshtoken
    {
        [Required]
        public string Token { get; set; }
        [Required]
        public string RefreshToken { get; set; }
    }
}
