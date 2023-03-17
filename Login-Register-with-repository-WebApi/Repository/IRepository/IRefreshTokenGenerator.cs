using Company_Project.Models;
using System.Security.Claims;

namespace Company_Project.Repository.IRepository
{
    public interface IRefreshTokenGenerator
    {
        ApplicationUser GenerateToken(ApplicationUser user, bool isGenerateRefreshToken);
        ClaimsPrincipal? GetClaimsFromExpiredToken(string token);
    }
}
