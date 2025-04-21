using PromptBuilder.Core.Models;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Repository interface for PromptTemplate entities
    /// </summary>
    public interface IPromptTemplateRepository : IRepository<PromptTemplate>
    {
        /// <summary>
        /// Get a prompt template by ID including its categories
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <returns>Template with categories or null</returns>
        Task<PromptTemplate?> GetTemplateWithCategoriesAsync(int id);
    }
}
