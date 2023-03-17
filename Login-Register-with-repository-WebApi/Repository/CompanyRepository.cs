using Company_Project.Models;
using Company_Project.Repository.IRepository;
using System.Linq.Expressions;

namespace Company_Project.Repository
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        private readonly ApplicationDbContext _context;
        public CompanyRepository(ApplicationDbContext context):base(context) 
        {
            _context = context;
        }

        // This method updates the Company entity in the database with the provided Company object.
        public void Update(Company company)
        {
            _context.Companies.Update(company);
            _context.SaveChanges();
        }
    }
}
