using Company_Project.Models;
using Company_Project.Repository.IRepository;

namespace Company_Project.Repository
{
    public class EmployeeDesignationRepository : Repository<EmployeeDesignation>, IEmployeeDesignationRepository
    {
        private readonly ApplicationDbContext _context;
        public EmployeeDesignationRepository(ApplicationDbContext context):base(context)
        {
            _context = context;
        }

        // This method updates the EmployeeDesignation entity in the database with the EmployeeDesignation Leave object.
        public void Update(EmployeeDesignation employeeDesignation)
        {
            _context.Update(employeeDesignation);
            _context.SaveChanges();
        }
    }
}
