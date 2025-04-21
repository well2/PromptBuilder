using PromptBuilder.Core.Models;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Repository interface for Category entities
    /// </summary>
    public interface ICategoryRepository : IRepository<Category>
    {
        /// <summary>
        /// Get all categories as a hierarchical tree structure
        /// </summary>
        /// <returns>List of root categories with their children</returns>
        Task<IEnumerable<Category>> GetCategoryTreeAsync();
        
        /// <summary>
        /// Get a category by ID including its prompt template
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>Category with prompt template or null</returns>
        Task<Category?> GetCategoryWithTemplateAsync(int id);
    }
}
