using System.Linq.Expressions;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Generic repository interface for CRUD operations
    /// </summary>
    /// <typeparam name="T">Entity type</typeparam>
    public interface IRepository<T> where T : class
    {
        /// <summary>
        /// Get all entities
        /// </summary>
        /// <returns>IEnumerable of entities</returns>
        Task<IEnumerable<T>> GetAllAsync();
        
        /// <summary>
        /// Get entities by condition
        /// </summary>
        /// <param name="predicate">Filter condition</param>
        /// <returns>IEnumerable of filtered entities</returns>
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        
        /// <summary>
        /// Get entity by ID
        /// </summary>
        /// <param name="id">Entity ID</param>
        /// <returns>Entity or null</returns>
        Task<T?> GetByIdAsync(int id);
        
        /// <summary>
        /// Add a new entity
        /// </summary>
        /// <param name="entity">Entity to add</param>
        Task AddAsync(T entity);
        
        /// <summary>
        /// Update an existing entity
        /// </summary>
        /// <param name="entity">Entity to update</param>
        void Update(T entity);
        
        /// <summary>
        /// Delete an entity
        /// </summary>
        /// <param name="entity">Entity to delete</param>
        void Delete(T entity);
        
        /// <summary>
        /// Delete an entity by ID
        /// </summary>
        /// <param name="id">ID of entity to delete</param>
        /// <returns>True if entity was deleted, false if not found</returns>
        Task<bool> DeleteByIdAsync(int id);
    }
}
