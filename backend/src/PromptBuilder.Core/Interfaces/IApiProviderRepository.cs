using PromptBuilder.Core.Models;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Repository interface for API Providers
    /// </summary>
    public interface IApiProviderRepository
    {
        /// <summary>
        /// Get all API providers
        /// </summary>
        /// <returns>Collection of API providers</returns>
        Task<IEnumerable<ApiProvider>> GetAllAsync();
        
        /// <summary>
        /// Get API provider by ID
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>API provider if found, null otherwise</returns>
        Task<ApiProvider?> GetByIdAsync(int id);
        
        /// <summary>
        /// Get the default API provider
        /// </summary>
        /// <returns>Default API provider if exists, null otherwise</returns>
        Task<ApiProvider?> GetDefaultAsync();
        
        /// <summary>
        /// Add a new API provider
        /// </summary>
        /// <param name="provider">Provider to add</param>
        /// <returns>Added provider</returns>
        Task<ApiProvider> AddAsync(ApiProvider provider);
        
        /// <summary>
        /// Update an existing API provider
        /// </summary>
        /// <param name="provider">Provider to update</param>
        /// <returns>Updated provider</returns>
        Task<ApiProvider> UpdateAsync(ApiProvider provider);
        
        /// <summary>
        /// Delete an API provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>True if deleted, false otherwise</returns>
        Task<bool> DeleteAsync(int id);
    }
}
