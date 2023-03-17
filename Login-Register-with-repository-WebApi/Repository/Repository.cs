using Company_Project.Models;
using Company_Project.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Company_Project.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly ApplicationDbContext _context;
        internal DbSet<T> dbSet;
        public Repository(ApplicationDbContext context)
        {
            _context = context;
            dbSet = _context.Set<T>();
        }

        // Add a new entity to the database
        public void Add(T entity)
        {
            dbSet.Add(entity);
            _context.SaveChanges();
        }

        // Get the first entity that satisfies a filter expression, with optional include properties
        public T FirstOrDefault(Expression<Func<T, bool>> filter = null, string includeProperties = null)
        {
            IQueryable<T> query = dbSet;
            if (filter != null)
                query = query.Where(filter);

            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.
                    RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }
            return query.FirstOrDefault();
        }

        // Get an entity by its ID
        public T Get(int id)
        {
            return dbSet.Find(id);
        }

        // Get all entities that satisfy a filter expression, with optional ordering and include properties
        public IEnumerable<T> GetAll(Expression<Func<T, bool>> filter = null, Func<IQueryable<T>, IOrderedQueryable<T>>
            orderBy = null, string includeProperties = null)  //Category,CoverType
        {
            IQueryable<T> query = dbSet;

            // Filter by expression
            if (filter != null)
                query = query.Where(filter);

            //Multiple Tables or Include related entities
            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' },
                    StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }

            //Sorting 

            if (orderBy != null)
                return orderBy(query).ToList();

            return query.ToList();
        }

        // Remove an entity from the database
        public void Remove(T entity)
        {
            dbSet.Remove(entity);
            _context.SaveChanges();

        }

        // Remove an entity by its ID
        public void Remove(int id)
        {
            //var entity = dbSet.Find(id);
            //dbSet.Remove(entity);

            var entity = Get(id);
            Remove(entity);
            _context.SaveChanges();

        }

        // Remove a range of entities from the database
        public void RemoveRange(IEnumerable<T> entity)
        {
            dbSet.RemoveRange(entity);
            _context.SaveChanges();

        }
    }
}
