using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net.NetworkInformation;
using System.Runtime.CompilerServices;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static System.Net.Mime.MediaTypeNames;
using System.Runtime.Intrinsics.X86;
using Company_Project.Migrations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Storage;
using System;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]

    public class CompanyController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly IDesignationRepository _designationRepository;
        private readonly IEmployeeDesignationRepository _employeeDesignationRepository;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;



        public CompanyController(IDesignationRepository designationRepository,
            ICompanyRepository companyRepository, IMapper mapper,
                        UserManager<ApplicationUser> userManager,
            ApplicationDbContext context, IEmployeeDesignationRepository employeeDesignationRepository, RoleManager<IdentityRole> roleManager)

        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _context = context;
            _designationRepository = designationRepository;
            _employeeDesignationRepository = employeeDesignationRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        //It Method will add employees
        [HttpPost]
        [Route("AddCompany")]
        [Authorize(Roles = UserRoles.Role_Admin)]

        public IActionResult AddCompany([FromBody] CompanyDTO companyDTO)
        {
            //Check if companyDTO is null or ModelState is invalid
            if ((companyDTO == null) && (!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            //Map the companyDTO to a Company entity
            var company = _mapper.Map<CompanyDTO, Company>(companyDTO);

            //Add the company to the repository
            _companyRepository.Add(company);

            //Return a success message
            return Ok(new { status = 1, message = "Company Added" });
        }

        //This method will Display the list of all companies
        [HttpGet]
        [Route("GetCompany")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult GetCompany()
        {
            //Get the user identity of the current user
            var claimIdentity = (ClaimsIdentity)User.Identity;

            //Get the name identifier claim
            var claim = claimIdentity.FindFirst(ClaimTypes.NameIdentifier);

            //Get all companies from the repository
            var companyList = _companyRepository.GetAll();

            //If companyList is null, return a not found status
            if (companyList == null) return NotFound();

            //Return the company list
            return Ok(companyList);
        }

        // This method is used to delete a company and all associated employees and user accounts        //In this updated code, we first check if the company with the given companyId exists in the database.
        //If it does not, we return a 404 NotFound status. Next, we query the database to get all the employees
        //that have the same companyId as the company being deleted. We then use the RemoveRange method to delete
        //all those employees from the database in a single operation.Finally, we delete the company itself and
        //save the changes to the database.

        [HttpDelete]
        [Route("DeleteCompany")]
        [Authorize(Roles = UserRoles.Role_Admin)]

        public IActionResult DeleteCompany(int companyId)
        {
            // Check if the companyId is valid
            if (companyId == null)
            {
                return NotFound();
            }

            // Find all employees in the company
            var employees = _context.Employees.Where(e => e.CompanyId == companyId).ToList();

            // Check if there are any employees associated with the company
            if (employees == null)
            {
                return NotFound();
            }

            // Delete the Designation assigned to employees
            foreach (var employee in employees)
            {
                // Find all the designations assigned to an employee
                var employeeDesignation = _context.employeeDesignations.Where(ed => ed.EmployeeId == employee.EmployeeId).ToList();

                // If the employee has a designation assigned to them, remove it
                if (employeeDesignation != null)
                {
                    _context.employeeDesignations.RemoveRange(employeeDesignation);
                }
            }


            // Delete all associated employees, their user accounts and roles
            foreach (var employee in employees)
            {
                // Find the user associated with the employee
                var user = _userManager.FindByIdAsync(employee.ApplicationUserId).Result;

                // Delete the employee
                _context.Employees.Remove(employee);

                // Delete the user's identity records
                var logins = _userManager.GetLoginsAsync(user).Result;
                foreach (var login in logins)
                {
                    var result = _userManager.RemoveLoginAsync(user, login.LoginProvider, login.ProviderKey).Result;
                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }
                var roles = _userManager.GetRolesAsync(user).Result;
                foreach (var role in roles)
                {
                    var result = _userManager.RemoveFromRoleAsync(user, role).Result;
                    if (!result.Succeeded)
                    {
                        return BadRequest(result.Errors);
                    }
                }

                // Remove the user from the Companies table
                var company = _context.Companies.FirstOrDefault(c => c.ApplicationUserId == user.Id);
                if (company != null)
                {
                    company.ApplicationUserId = null;
                }

                // Delete the user
                var result2 = _userManager.DeleteAsync(user).Result;
                if (!result2.Succeeded)
                {
                    return BadRequest(result2.Errors);
                }
            }

            // Delete the company
            var companyToDelete = _context.Companies.Find(companyId);
            if (companyToDelete != null)
            {
                _context.Companies.Remove(companyToDelete);
            }
            _context.SaveChanges();

            return Ok();
        }




        //This method will update company
        [HttpPut]
        [Route("UpdateCompany")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult UpdateCompany([FromBody] CompanyDTO companyDTO)
        {
            // Check if companyDTO is null or ModelState is not valid, return bad request
            if ((companyDTO == null) && (!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            // Map CompanyDTO to Company
            var company = _mapper.Map<Company>(companyDTO);

            // Update company in the repository
            _companyRepository.Update(company);

            // Return success message
            return Ok(new { message = "Company Updated Sucessfully" });
        }

        [HttpPost]
        [Route("AddDesignation")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult AddDesignation([FromBody] DesignationDTO designationDTO)
        {
            // Check if designationDTO is null or ModelState is not valid, return bad request
            if (!(designationDTO != null) && (ModelState.IsValid))
            {    
                // Return bad request with ModelState errors
                return BadRequest(ModelState);
            }

            // Map DesignationDTO to Designation
            var designation = _mapper.Map<DesignationDTO, Designation>(designationDTO);

            //Here we stores designation name That is pass and stores it in variable
            var desig = designationDTO.Name;

            //Here we find that the designation is exist in database or not
            var designationInDb = _context.Designations.FirstOrDefault(designation => designation.Name == desig);

            // If the designation already exists in the database, return error message
            if (designationInDb != null)
            {
                //If above condition is true then it will return
                return Ok(new { status = 2, message = "Designation Added sucessfully(exist)" });
            }

            // Add the designation to the repository
            _designationRepository.Add(designation);

            // Return success message
            return Ok(new { status = 1, messgae = "Designation created sucessfully" });
        }


        // Add employee designation
        [HttpPost]
        [Route("AddEmployeeDesignation")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult AddEmployeeDesignation([FromBody] EmployeeDesignationDTO employeeDesignationDTO)
        {
            // Check if employeeDesignationDTO is null or ModelState is not valid, return bad request
            if ((employeeDesignationDTO == null) && (!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            // Get the designation from the database based on its name
            var dsgIdInDb = _context.Designations.FirstOrDefault(dsg => dsg.Name == employeeDesignationDTO.DesignationNAme);

            // If the designation does not exist in the database, return error message
            if (dsgIdInDb == null)
            {
                return Ok(new { status = 2, message = "Designation not Added or Spelling Mistake" });
            }

            // Set the employee designation ID to the designation ID from the database
            employeeDesignationDTO.DesignationId = dsgIdInDb.DesignationId;

            // Map EmployeeDesignationDTO to EmployeeDesignation
            var employeeDesignation = _mapper.Map<EmployeeDesignationDTO, EmployeeDesignation>(employeeDesignationDTO);

            // Add the employee designation to the repository
            _employeeDesignationRepository.Add(employeeDesignation);

            // Return success message
            return Ok(new { message = "Employee Designation Addded Sucessfully" });

        }

        // This method returns  employee designations.
        [HttpGet]
        [Route("GetEmployeeDesignation")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult GetEmployeeDesignation()
        {
            var employeeDesignations = _employeeDesignationRepository.GetAll();
            if (employeeDesignations == null) return NotFound();
            return Ok(employeeDesignations);

        }

        // This method returns all designations.
        [HttpGet]
        [Route("GetDesignations")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult GetDesignations()
        {
            var Designations = _designationRepository.GetAll();
            if (Designations == null) return NotFound();
            return Ok(Designations);

        }

        // This method returns all employees of a company.
        [HttpGet]
        [Route("EmployeesInTheCompany")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult EmployeesInTheCompany(int companyId)
        {
            var empInDb = _context.Employees.Where(e => e.CompanyId == companyId).ToList();
            if (empInDb == null) return NotFound(new { message = "No employee registered in the company" });
            return Ok(new { empInDb, message = "Employee List Sucessfully" });
        }



        //In this method, i have displayed the employees of the the same company, that have assigned any designation
        [HttpGet]
        [Route("EmployeesWithDesignationsInCompany/{companyId}")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult EmployeesWithDesignationsInCompany(int companyId)
        {
            var employees = _context.Employees
                .Where(e => e.CompanyId == companyId)
                .Include(e => e.EmployeeDesignations)
                .ThenInclude(ed => ed.Designation)
                .Where(e => e.EmployeeDesignations.Any())
                .Select(e => new
                {
                    EmployeeId = e.EmployeeId,
                    EmployeeName = e.EmployeeName,
                    Designations = e.EmployeeDesignations.Select(ed => ed.Designation.Name)
                })
                .ToList();

            if (employees.Count == 0)
            {
                return NotFound(new { message = "No employee registered in the company" });
            }

            return Ok(employees);
        }

        // This method deletes designation of a particular employee.
        [HttpDelete]
        [Route("DeleteEmployeesWithDesignationsInCompany")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult DeleteEmployeesWithDesignationsInCompany(int employeeId)
        {
            if (employeeId == null) return NotFound();
            var employee = _employeeDesignationRepository.FirstOrDefault(a => a.EmployeeId == employeeId);
            if (employee == null) return NotFound();
            _employeeDesignationRepository.Remove(employee);
            return Ok(new { status = 1, message = "Employee Removed from Designation" });
        }


        // This method returns company details for specific users.
        [HttpGet("GetCompanyForSpecificUsers")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public async Task<IActionResult> GetCompanyForSpecificUsers(string username)
        {
            // Retrieve user object based on username
            var user = _context.Users.ToList().Where(a => a.UserName == username).FirstOrDefault();

            if (!string.IsNullOrEmpty(username))
            {
                if (user.Id != null)
                {
                    // Get user's roles
                    var roles = await _userManager.GetRolesAsync(user);
                    if (roles.Contains(UserRoles.Role_Admin))
                    {
                        // If user is an admin, return all companies
                        return Ok(_context.Companies.ToList());
                    }
                    if (roles.Contains(UserRoles.Role_Employee))
                    {
                        // If user is an employee, return their company's details
                        var employee = _context.Employees.FirstOrDefault(e => e.ApplicationUserId == user.Id);
                        if (employee == null) return NotFound();
                        var emp = _context.Companies.Find(employee.CompanyId);

                        // Add the data to the array
                        var companies = new Company[] 
                        {
                            new Company // Add the data to the array
                            {
                                CompanyId=emp.CompanyId,
                                CompanyName=emp.CompanyName,
                                CompanyAddress=emp.CompanyAddress,
                                CompanyGST=emp.CompanyGST, 
                            }
                        };

                        // Return the array of Company objects
                        return Ok(companies); 
                    }
                    if (roles.Contains(UserRoles.Role_Company))
                    {
                        // If user is a company, return their company's details
                        var companies = await _context.Companies.Where(c => c.ApplicationUserId == user.Id).ToListAsync();
                        return Ok(companies);
                    }

                    // If user is not in any of the expected roles, return not found
                    else return NotFound();

                }
                // If user object is not found, return not found
                else return NotFound();

            }
            // If username is null or empty, return not found
            else return NotFound();

        }

        //this menthod retur, specific employee details
        [HttpGet("GetEmployeeForSpecificUsers")]
        [Authorize(Roles = UserRoles.Role_Employee)]
        public async Task<IActionResult> GetEmployeeForSpecificUsers(string username)
        {
            if (string.IsNullOrEmpty(username))
            {
                return NotFound(new { message = "Username is required" });
            }

            // Retrieve user object based on username
            var user = _context.Users.FirstOrDefault(a => a.UserName == username);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Check if user is an employee
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains(UserRoles.Role_Employee))
            {
                return NotFound(new { message = "User is not in role of employee" });
            }

            // Retrieve employee object associated with user
            var employees = _context.Employees.Where(e => e.ApplicationUserId == user.Id).ToList();
            if (employees.Count == 0)
            {
                return NotFound(new { message = "Employee not found" });
            }

            //Here i want EmployeeId and want to send it in frontend so finding EmployeeId
            var emp = _context.Employees.FirstOrDefault(a => a.ApplicationUserId == user.Id);
            if (employees == null)
            {
                return NotFound(new { message = "Employee not found" });
            }
            var EmployeeId = emp.EmployeeId;
            return Ok(new {employees, EmployeeId });
        }

    }
}
