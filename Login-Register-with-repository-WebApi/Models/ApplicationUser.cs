using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace Company_Project.Models
{
    public class ApplicationUser:IdentityUser
    {
        [NotMapped]
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenValidDate { get; set; }
        public string? Salary { get; set; }
        public string? Name { get; set; }
        [NotMapped]
        public string? Role { get; set; }

      

    }
}
