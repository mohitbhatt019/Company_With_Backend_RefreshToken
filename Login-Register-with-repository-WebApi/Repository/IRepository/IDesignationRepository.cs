using Company_Project.Models;

namespace Company_Project.Repository.IRepository
{
    public interface IDesignationRepository:IRepository<Designation>
    {
        void Update(Designation designation);
    }
}
