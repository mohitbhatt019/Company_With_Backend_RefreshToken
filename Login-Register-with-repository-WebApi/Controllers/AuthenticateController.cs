﻿using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IAuthenticateRepository _authenticateRepository;
        private readonly ApplicationDbContext _context;
        private readonly ICompanyRepository _companyRepository;
        private readonly IRefreshTokenGenerator _jwtManager;




        public AuthenticateController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            IAuthenticateRepository authenticateRepository,ApplicationDbContext context,
            ICompanyRepository companyRepository, IRefreshTokenGenerator jwtManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _authenticateRepository = authenticateRepository;
            _context = context;
            _companyRepository = companyRepository;
            _jwtManager = jwtManager;
        }
        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel registerModel)
        {

            // Check if the data in the request body is valid
            if (!ModelState.IsValid) return BadRequest();

            // Check if the username is unique
            var userExists = await _authenticateRepository.IsUnique(registerModel.Username);
           if (userExists == null) return BadRequest(userExists);

           //Here we checking that user email is registed with any company or not, if not then it show error
            bool checkEmail = await _context.Users.AnyAsync(a => a.Email == registerModel.Email);
            if (checkEmail) return BadRequest(new { message = "User alredy Exist in company" });

            // Create a new ApplicationUser 
            var user = new ApplicationUser
            {
                UserName = registerModel.Username,
                Email = registerModel.Email,
                PasswordHash=registerModel.Password,
                Role=registerModel.Role
            };

            // Attempt to register the user with the repository
            var result = await _authenticateRepository.RegisterUser(user);

            // If registration was not successful, return a 500 error
            if (!result) return StatusCode(StatusCodes.Status500InternalServerError);

            // If registration was successful, return a success message
            return Ok(new { Message = "Register successfully!!!" });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult>Login(LoginModel loginModel)
        {
            // Check if the user is registered
            if (await _authenticateRepository.IsUnique(loginModel.Username)) 
                return BadRequest(new { Message = "Please Register first then login!!!" });

            // Authenticate the user
            var userAuthorize = await _authenticateRepository.AuthenticateUser(loginModel.Username, loginModel.Password);
          
                if (userAuthorize == null) return NotFound("Invalid Attempt");
                return Ok(  userAuthorize );
        }

        [Route("RefreshToken")]
        [HttpPost]
        public async Task<IActionResult> RefreshToken(Refreshtoken userToken)
        {
            if (userToken == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            var claimToken = _jwtManager.GetClaimsFromExpiredToken(userToken.Token);
            if (claimToken == null)
            {
                return BadRequest();
            }
            var claimIdentity = claimToken.Identity as ClaimsIdentity;
            var claimUser = claimIdentity?.FindFirst(ClaimTypes.Name) ?? null;
            if (claimUser == null)
            {
                return Unauthorized();
            }
            var checkInDb = await _authenticateRepository.CheckUserInDb(claimUser.Value);
            if (checkInDb == null) { return BadRequest(); }
            if (checkInDb.RefreshToken != userToken.RefreshToken) return Unauthorized("Go Login First");
            if (checkInDb.RefreshTokenValidDate < DateTime.Now) return BadRequest();
            var generateNewToken = _jwtManager.GenerateToken(checkInDb, false);
            Refreshtoken usertoken = new Refreshtoken()
            {
                Token = generateNewToken?.Token ?? "null",
                RefreshToken = generateNewToken?.RefreshToken ?? "null",
            };
            return Ok(usertoken);
        }

    }
}
