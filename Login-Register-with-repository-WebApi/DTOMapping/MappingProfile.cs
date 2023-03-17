using AutoMapper;
using Company_Project.Models;
using Company_Project.Models.DTO;
using Company_Project.Models.DTOs;

namespace Company_Project.DTOMapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Company, CompanyDTO>().ReverseMap();
            CreateMap<Employee,EmployeeDTO>().ReverseMap();
            CreateMap<Designation, DesignationDTO>().ReverseMap();
            CreateMap<EmployeeDesignation, EmployeeDesignationDTO>().ReverseMap();
            CreateMap<Employee, EditEmployeeDTO>().ReverseMap();
            CreateMap<Leave, LeaveDTO>().ReverseMap();

        }
    }
}
