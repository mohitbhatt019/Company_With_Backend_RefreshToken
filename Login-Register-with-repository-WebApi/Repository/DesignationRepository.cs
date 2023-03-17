using Company_Project.Models;
using Company_Project.Repository.IRepository;

namespace Company_Project.Repository
{
    public class DesignationRepository : Repository<Designation>, IDesignationRepository
    {
        private readonly ApplicationDbContext _context;
        public DesignationRepository(ApplicationDbContext context) : base(context)
        {
            _context = context;
        }

        // This method updates the Designation entity in the database with the provided Designation object.
        public void Update(Designation designation)
        {
            _context.Designations.Update(designation);
            _context.SaveChanges();
        }
    }
}
