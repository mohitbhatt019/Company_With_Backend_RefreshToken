using Company_Project.Models;

namespace Company_Project.Repository.IRepository
{
    public interface IAuthenticateRepository
    {
        Task<bool> IsUnique(string userName);
        Task<ApplicationUser> AuthenticateUser(string userName, string userPassword);
        Task<bool> RegisterUser(ApplicationUser registerModel);

    }
}
