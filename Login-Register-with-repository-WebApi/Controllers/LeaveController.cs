using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;
using Company_Project.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Globalization;
using System.Security.Claims;

namespace Company_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class LeaveController : ControllerBase
    {
        private readonly ILeaveRepository _leaveRepository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public LeaveController(ILeaveRepository leaveRepository,IMapper mapper, ApplicationDbContext context)
        {
            _leaveRepository = leaveRepository;
            _mapper= mapper;
            _context= context;
        }

        // This API allows an employee to apply for a leave
        [HttpPost]
        [Route("AddLeave")]
        [Authorize(Roles = UserRoles.Role_Employee)]

        public async Task<IActionResult> AddLeave(LeaveDTO leaveDTO)
        {
            // Check if the input is null or invalid
            if ((leaveDTO == null) && (!ModelState.IsValid))
            {
                return BadRequest(ModelState);
            }

            // Check if the user has already applied for a leave with leave status pending
            var existingLeaveRequest = _context.Leaves.FirstOrDefault(a=>a.LeaveStatus == LeaveStatus.Pending);

            // If the user has already applied for a leave with pending status, return an Ok response with a message indicating that the request already exists
            if (existingLeaveRequest != null)
            {
                return Ok(new { message = "Leave request already exists with pending status" });
            }

            // If the user has not applied for a leave with pending status, add the new leave request
            var leave = _mapper.Map<LeaveDTO, Leave>(leaveDTO);
            _leaveRepository.Add(leave);
            // Return an Ok response with the leave ID, status code 1, and a message indicating successful leave application
            var leaveIdInDb = leave.LeaveId;
            return Ok(new { leaveIdInDb, status = 1, message = "Leave applied successfully" });
        }

        // This API  allows an authorized user to retrieve all leave requests
        [HttpGet]
        [Route("AllLeaves")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public async Task<IActionResult> AllLeaves()
        {
            // Get all leave requests from the leave repository
            var leaveList =_leaveRepository.GetAll();

            // If the leave list is null, return a NotFound response with a message indicating that no employee has applied for leave
            if (leaveList==null) return NotFound(new {message="No Employee Applied for leave"});

            // Return an Ok response with the leave list
            return Ok(leaveList);
        }

        // This method updates the leave status of an employee's leave request
        // Only company and admin users are authorized to perform this action
        [HttpPut]
        [Route("UpdateLeaveStatus")]
        //[Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company )]
        //FRom this method, Company And admin user can Approve or reject the leave request of employee
        public async Task<IActionResult> UpdateLeaveStatus(int leaveId, LeaveStatus leaveStatus)
        {

            var leave = _leaveRepository.Get(leaveId);
            if (leave == null) return NotFound(new { message = "Leave not found" });

            leave.LeaveStatus = leaveStatus;
            _leaveRepository.Update(leave);

            return Ok(new { status = 1, message = "Leave status updated successfully" });
        }

        // This method retrieves the leave details of a specific employee
        // Only admin, company, and employee users are authorized to access this method
        [HttpGet]
        [Route("SpecificEmployeeLeaves")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company + "," + UserRoles.Role_Employee)]

        public async Task<IActionResult> SpecificEmployeeLeaves(int employeeId)
        {
            var leaveList = _leaveRepository.GetAll().Where(emp=>emp.EmployeeId==employeeId);
            if (leaveList == null) return NotFound(new { message = "No Employee Applied for leave" });
            return Ok(leaveList);
        }

        // This method retrieves the list of employees who are currently on leave in a specific company
        [Route("SpecificCompanyLeave")]
        [HttpPost]
        public IActionResult SpecificCompanyLeave(int companyId)
        {
            if (companyId == 0) return BadRequest();

            // Get the list of employees whose employee id is equal to companyId
            var companyEmployees = _context.Employees.Where(e => e.CompanyId == companyId).ToList();

            // Get the list of employees available in the leave table
            var employeesOnLeave = _context.Leaves.Select(l => l.Employee).ToList();

            // Return both lists as a JSON object
            return Ok(new { CompanyEmployees = companyEmployees, EmployeesOnLeave = employeesOnLeave });
        }

        //In this api, Company User able to see All the Leaved that are applied in its Employee
        //CompanyUserLeave list
        [HttpGet]
        [Route("GetLeavesByCompanyId")]
        [Authorize(Roles = UserRoles.Role_Admin + "," + UserRoles.Role_Company)]

        public IActionResult GetLeavesByCompanyId(int companyId)
        {
            var leaves =  _context.Leaves
                .Where(l => l.Employee.CompanyId == companyId)
                
                .ToList();

            return Ok(leaves);
        }


    }

}

