using Company_Project.Models;

namespace Company_Project.Repository.IRepository
{
    public interface ILeaveRepository:IRepository<Leave>
    {
        void Update(Leave leave);
    }
}
