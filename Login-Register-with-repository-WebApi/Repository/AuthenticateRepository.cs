using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Company_Project.Repository
{
    public class AuthenticateRepository : IAuthenticateRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IRefreshTokenGenerator _tokenGenrator;
        private readonly JWTSetting _jwtSetting;

        public AuthenticateRepository(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IRefreshTokenGenerator tokenGenrator, IOptions<JWTSetting> jwtSetting)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtSetting = jwtSetting.Value;
            _tokenGenrator = tokenGenrator;


        }

        // Method to authenticate a user with their username and password
        public async Task<ApplicationUser> AuthenticateUser(string userName, string userPassword)
        {
            // Find the user with the given username
            var userExist = await _userManager.FindByNameAsync(userName);

            // Verify the user's password
            var VERIFY = await _signInManager.CheckPasswordSignInAsync(userExist, userPassword,false);

            // If the password is correct, return the user
            if (!VERIFY.Succeeded) return null;

            // Retrieve the user's roles
            var roles = await _userManager.GetRolesAsync(userExist);

            // Set the user's role string to the first role in the roles list
            //var userRoles = await _userManager.GetRolesAsync(userExist);
            //var userRoleString = userRoles.Count > 0 ? userRoles[0] : "";


            var roleUser = await _userManager.GetRolesAsync(userExist);
            userExist.Role = roleUser.FirstOrDefault();
            if (userExist.RefreshTokenValidDate < DateTime.Now)
            {
                var userToken = _tokenGenrator.GenerateToken(userExist, true);
                return await AddOrUpdateUserRefreshToken(userToken);
            }
            return _tokenGenrator.GenerateToken(userExist, false);
        }

        public async Task<ApplicationUser?> CheckUserInDb(string userName)
        {
            var UserInDb = await _userManager.FindByIdAsync(userName);
            if (UserInDb == null) return null;
            var userGetRole = await _userManager.GetRolesAsync(UserInDb);
            UserInDb.Role = userGetRole?.FirstOrDefault();
            return UserInDb;
        }
        public async Task<ApplicationUser?> AddOrUpdateUserRefreshToken(ApplicationUser user)
        {
            user.RefreshTokenValidDate = DateTime.Now.AddSeconds(_jwtSetting.RefreshTokenExpireDays);
            var userD = await _userManager.UpdateAsync(user);
            return userD.Succeeded ? user : null;
        }

        public async Task<bool> IsUnique(string userName)
        {
            // Find a user with the given username
            var duplicateUser = await _userManager.FindByNameAsync(userName);

            // If a user with the same username is found, return false
            if (duplicateUser != null) { return false; }

            // If no user with the same username is found, return true
            else { return true; }
        }


        // Method to register a new user
        public async Task<bool> RegisterUser(ApplicationUser registerModel)
        {
            // Create a new user with the given registerModel and password
            var user = await _userManager.CreateAsync(registerModel, registerModel.PasswordHash);
            //await _userManager.AddToRoleAsync(registerModel, UserRoles.Role_Admin);

            //admin
            //await _userManager.AddToRoleAsync(user, UserRoles.Role_Admin);

            // If user creation fails, return false
            if (!user.Succeeded) return false;

            // If user creation succeeds, add the user to their assigned role and return true
            else
                await _userManager.AddToRoleAsync(registerModel, registerModel.Role);
            return true;
        }

    }


       
    
}
