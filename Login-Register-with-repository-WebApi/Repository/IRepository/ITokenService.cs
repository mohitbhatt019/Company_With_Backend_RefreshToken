using Company_Project.Models;
using System.Security.Claims;

namespace Company_Project.Repository.IRepository
{
    public interface ITokenService
    {
        TokenResponse GetToken(IEnumerable<Claim> claim);
        string GetRefreshToken();
        ClaimsPrincipal GetPrincipleFromExpiredToken(string token);
    }
}
