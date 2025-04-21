using PromptBuilder.Core.DTOs;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Service interface for API Providers
    /// </summary>
    public interface IApiProviderService
    {
        /// <summary>
        /// Get all API providers
        /// </summary>
        /// <returns>Collection of API provider DTOs</returns>
        Task<IEnumerable<ApiProviderDto>> GetAllProvidersAsync();
        
        /// <summary>
        /// Get API provider by ID
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>API provider DTO if found, null otherwise</returns>
        Task<ApiProviderDto?> GetProviderByIdAsync(int id);
        
        /// <summary>
        /// Get the default API provider
        /// </summary>
        /// <returns>Default API provider DTO if exists, null otherwise</returns>
        Task<ApiProviderDto?> GetDefaultProviderAsync();
        
        /// <summary>
        /// Create a new API provider
        /// </summary>
        /// <param name="providerDto">Provider DTO to create</param>
        /// <returns>Created provider DTO</returns>
        Task<ApiProviderDto> CreateProviderAsync(CreateApiProviderDto providerDto);
        
        /// <summary>
        /// Update an existing API provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <param name="providerDto">Provider DTO with updated values</param>
        /// <returns>Updated provider DTO</returns>
        Task<ApiProviderDto> UpdateProviderAsync(int id, UpdateApiProviderDto providerDto);
        
        /// <summary>
        /// Delete an API provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>True if deleted, false otherwise</returns>
        Task<bool> DeleteProviderAsync(int id);
        
        /// <summary>
        /// Get available models for a provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>Collection of model DTOs</returns>
        Task<IEnumerable<LlmModelDto>> GetAvailableModelsAsync(int id);
    }
}
