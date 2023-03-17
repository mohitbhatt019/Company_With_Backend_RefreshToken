using System.Linq.Expressions;

namespace Company_Project.Repository.IRepository
{
    public interface IRepository<T> where T : class
    {
        void Add(T entity);                         //Add
        void Remove(T entity);                     //Remove though Table name
        void Remove(int id);                       //Remove though id
        void RemoveRange(IEnumerable<T> entity);   //Multiple Records
        T Get(int id);                             //Find from id & return T
        IEnumerable<T> GetAll(                     //Display=include,Sorting,Filter

            Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
            string includeProperties = null

              );

        T FirstOrDefault(

            Expression<Func<T, bool>> filter = null,
            string includeProperties = null
            );

    }
}
