using Company_Project.Models;

namespace Company_Project.Repository.IRepository
{
    public interface IEmployeeRepository:IRepository<Employee>
    {
        void Update(Employee employee);
    }
}
