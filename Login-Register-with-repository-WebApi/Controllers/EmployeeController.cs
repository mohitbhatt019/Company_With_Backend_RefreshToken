using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.Design;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeRepository _employeeRepository;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ICompanyRepository _companyRepository;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IAuthenticateRepository _authenticateRepository;
        private readonly UserManager<ApplicationUser> _userManager;



        public EmployeeController(IEmployeeRepository employeeRepository, IMapper mapper, ApplicationDbContext context,
            ICompanyRepository companyRepository, RoleManager<IdentityRole> roleManager, IAuthenticateRepository authenticateRepository, UserManager<ApplicationUser> userManager)
        {
            _employeeRepository = employeeRepository;
            _mapper = mapper;
            _context = context;
            _companyRepository = companyRepository;
            _roleManager = roleManager;
            _authenticateRepository = authenticateRepository;
            _userManager = userManager;
        }

        //this method will add Employees and from here we can know that which employee belongs to which company
        //here i have add a check that if user is entering a random company id so first it will find in the database
        //that the companyId entered by user is exist or not
        [HttpPost]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public async Task<IActionResult> AddEmployee(EmployeeDTO employeeDTO)
        {
            // Check if the employeeDTO object is not null and ModelState is valid
            if (!(employeeDTO != null)&&(ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            // Check if the email already exists in the database
            bool checkEmail = await _context.Users.AnyAsync(a => a.Email == employeeDTO.Email);
            if (checkEmail) return BadRequest(new { message = "User alredy Exist in company" });

            // Check if a "Company" employee already exists for the company
            var companyEmployees = _context.Employees.Where(e => e.CompanyId == employeeDTO.CompanyId).ToList();
            if (companyEmployees != null && companyEmployees.Any())
            {
                var existingCompanyEmployee = companyEmployees.Where(e => e.Role == UserRoles.Role_Company).ToList();
                if (existingCompanyEmployee.Count==1 && employeeDTO.Role==UserRoles.Role_Company)
                {
                    return BadRequest(new { message = "A 'Company' employee already exists for the company." });
                }
            }

            // Map the employeeDTO object to Employee object
            var employee = _mapper.Map<Employee>(employeeDTO);

            // Check if the username is unique
            var userExists = await _authenticateRepository.IsUnique(employeeDTO.Username);
            if (userExists == null) return BadRequest(userExists);

            // If the employee's role is not set, set it to "Employee"
            if (employeeDTO.Role=="")
            {
                employeeDTO.Role = UserRoles.Role_Employee;
            }

            // Create a new ApplicationUser object with employee details
            var user = new ApplicationUser
            {
                UserName = employeeDTO.Username,
                Email = employeeDTO.Email,
                PasswordHash = employeeDTO.Password,
                Role = employeeDTO.Role,
            };

            // Register the new user
            var result = await _authenticateRepository.RegisterUser(user);
            employee.ApplicationUserId = user.Id;
            _employeeRepository.Add(employee);
            if (!result) return StatusCode(StatusCodes.Status500InternalServerError);

            // Check if any Company User exists and save ApplicationUserId of CompanyUser in Company Table

            //Here i am saving ApplicationUserId of CompanyUser in Company Table

            if (employeeDTO.Role == UserRoles.Role_Company)
            {
                var companyId = employeeDTO.CompanyId;
                var companyInDb = _context.Companies.Find(companyId);
                if (companyInDb == null) return NotFound(new { message = "company Not exist" });
                companyInDb.ApplicationUserId = employee.ApplicationUserId;
                _context.SaveChanges();
            }
            return Ok(new { status=1,Message = "Register successfully!!!" }); 
        }

        //This method will give the list of employees
        [HttpGet]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult GetEmployees()
        {
            var employeeList = _employeeRepository.GetAll();
            if(employeeList ==null) return NotFound(new { message = "No Employee Found" });
            return Ok(employeeList);
        }

        //This method will update the employees
        [HttpPut]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public IActionResult UpdateEmployee(EmployeeDTO employeeDTO)
        {
            // Check if the employeeDTO object is not null and ModelState is valid
            if (!(employeeDTO != null) && (ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            var employee = _mapper.Map<Employee>(employeeDTO);

            _employeeRepository.Update(employee);
            return Ok(new { message = "Employee Updated Sucessfully" });
        }

        //This method will delete the employee
        [HttpDelete]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]
        public IActionResult DeleteEmployees(int employeeId)
        {
            // Check if employeeId is 0, return NotFound if true
            if (employeeId == 0) return NotFound();

            // Get the employee with the provided ID
            var employee = _employeeRepository.Get(employeeId);

            // Find all employee designations associated with the employee and remove them
            var empInDsg = _context.employeeDesignations.Where(a => a.EmployeeId == employeeId).ToList();
            if (empInDsg.Count !=0) { _context.employeeDesignations.RemoveRange(empInDsg); }

            // Remove the employee from the employee repository
            _employeeRepository.Remove(employeeId);

            // Find the user associated with the employee
            var user = _userManager.FindByIdAsync(employee.ApplicationUserId).Result;

            // Delete the user's identity records
            // Find all logins associated with the user and remove them
            var logins = _userManager.GetLoginsAsync(user).Result;
            foreach (var login in logins)
            {
                var result = _userManager.RemoveLoginAsync(user, login.LoginProvider, login.ProviderKey).Result;
                if (!result.Succeeded)
                {
                    // If removing login fails, return BadRequest with the error messages
                    return BadRequest(result.Errors);
                }
            }

            // Find all roles associated with the user and remove them
            var roles = _userManager.GetRolesAsync(user).Result;
            foreach (var role in roles)
            {
                var result = _userManager.RemoveFromRoleAsync(user, role).Result;
                if (!result.Succeeded)
                {
                    // If removing role fails, return BadRequest with the error messages
                    return BadRequest(result.Errors);
                }
            }

            // This line deletes the user using the _userManager and blocks until the operation is completed.
            var result2 = _userManager.DeleteAsync(user).Result;

            // Check if the operation succeeded. If it failed, return a BadRequest response with the error messages.
            if (!result2.Succeeded)
            {
                return BadRequest(result2.Errors);
            }

            // If the operation succeeded, return an Ok response with a message indicating successful deletion and a status code of 1.
            return Ok(new { message = "Employee Deleted Sucessfully", status = 1 });

        }
    }
}
