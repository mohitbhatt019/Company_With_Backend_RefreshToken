using Company_Project.Models;

namespace Company_Project.Repository.IRepository
{
    public interface IEmployeeDesignationRepository:IRepository<EmployeeDesignation>
    {
        void Update(EmployeeDesignation employeeDesignation);
    }
}
