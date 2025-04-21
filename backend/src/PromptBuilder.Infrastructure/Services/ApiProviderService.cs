using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;

namespace PromptBuilder.Infrastructure.Services
{
    /// <summary>
    /// Service implementation for API Providers
    /// </summary>
    public class ApiProviderService : IApiProviderService
    {
        private readonly IApiProviderRepository _repository;
        private readonly HttpClient _httpClient;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="repository">API provider repository</param>
        /// <param name="httpClient">HTTP client</param>
        public ApiProviderService(IApiProviderRepository repository, HttpClient httpClient)
        {
            _repository = repository;
            _httpClient = httpClient;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<ApiProviderDto>> GetAllProvidersAsync()
        {
            var providers = await _repository.GetAllAsync();
            return providers.Select(MapToDto);
        }

        /// <inheritdoc/>
        public async Task<ApiProviderDto?> GetProviderByIdAsync(int id)
        {
            var provider = await _repository.GetByIdAsync(id);
            return provider != null ? MapToDto(provider) : null;
        }

        /// <inheritdoc/>
        public async Task<ApiProviderDto?> GetDefaultProviderAsync()
        {
            var provider = await _repository.GetDefaultAsync();
            return provider != null ? MapToDto(provider) : null;
        }

        /// <inheritdoc/>
        public async Task<ApiProviderDto> CreateProviderAsync(CreateApiProviderDto providerDto)
        {
            var provider = new ApiProvider
            {
                Name = providerDto.Name,
                ProviderType = providerDto.ProviderType,
                ApiKey = providerDto.ApiKey,
                ApiUrl = providerDto.ApiUrl,
                IsDefault = providerDto.IsDefault,
                ConfigOptions = providerDto.ConfigOptions
            };

            var result = await _repository.AddAsync(provider);
            return MapToDto(result);
        }

        /// <inheritdoc/>
        public async Task<ApiProviderDto> UpdateProviderAsync(int id, UpdateApiProviderDto providerDto)
        {
            var provider = await _repository.GetByIdAsync(id);
            if (provider == null)
            {
                throw new KeyNotFoundException($"API Provider with ID {id} not found");
            }

            provider.Name = providerDto.Name;
            provider.ProviderType = providerDto.ProviderType;
            provider.ApiKey = providerDto.ApiKey;
            provider.ApiUrl = providerDto.ApiUrl;
            provider.IsDefault = providerDto.IsDefault;
            provider.ConfigOptions = providerDto.ConfigOptions;

            var result = await _repository.UpdateAsync(provider);
            return MapToDto(result);
        }

        /// <inheritdoc/>
        public async Task<bool> DeleteProviderAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<LlmModelDto>> GetAvailableModelsAsync(int id)
        {
            var provider = await _repository.GetByIdAsync(id);
            if (provider == null)
            {
                throw new KeyNotFoundException($"API Provider with ID {id} not found");
            }

            // Only supporting OpenRouter
            return await GetOpenRouterModelsAsync(provider);
        }

        /// <summary>
        /// Get available models from OpenRouter
        /// </summary>
        /// <param name="provider">API provider</param>
        /// <returns>Collection of model DTOs</returns>
        private async Task<IEnumerable<LlmModelDto>> GetOpenRouterModelsAsync(ApiProvider provider)
        {
            try
            {
                // Set up the headers according to OpenRouter documentation
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", provider.ApiKey);

                // Add recommended headers for OpenRouter leaderboards
                _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://promptbuilder.app");
                _httpClient.DefaultRequestHeaders.Add("X-Title", "PromptBuilder");

                // Get models from OpenRouter API
                var response = await _httpClient.GetAsync("https://openrouter.ai/api/v1/models");
                response.EnsureSuccessStatusCode();

                var content = await response.Content.ReadAsStringAsync();
                var modelsResponse = JsonSerializer.Deserialize<OpenRouterModelsResponse>(content, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (modelsResponse?.Data == null)
                {
                    return Enumerable.Empty<LlmModelDto>();
                }

                // Convert OpenRouter models to our DTO format
                // Include the full model ID (e.g., "openai/gpt-4o") for use with the API
                return modelsResponse.Data.Select(m => new LlmModelDto
                {
                    Id = m.Id,
                    Name = m.Name ?? m.Id,
                    Description = m.Description,
                    ContextLength = m.Context_Length,
                    Provider = m.Provider,
                    // Add additional properties from OpenRouter model data
                    PricingPrompt = m.Pricing?.Prompt,
                    PricingCompletion = m.Pricing?.Completion
                }).OrderBy(m => m.Name); // Sort models by name for better display
            }
            catch (Exception ex)
            {
                // Log the error and return an empty list
                Console.Error.WriteLine($"Error fetching OpenRouter models: {ex.Message}");
                return Enumerable.Empty<LlmModelDto>();
            }
        }

        /// <summary>
        /// Map API Provider entity to DTO
        /// </summary>
        /// <param name="provider">Provider entity</param>
        /// <returns>Provider DTO</returns>
        private static ApiProviderDto MapToDto(ApiProvider provider)
        {
            return new ApiProviderDto
            {
                Id = provider.Id,
                Name = provider.Name,
                ProviderType = provider.ProviderType,
                ApiUrl = provider.ApiUrl,
                IsDefault = provider.IsDefault
            };
        }

        /// <summary>
        /// Response class for OpenRouter models API
        /// </summary>
        private class OpenRouterModelsResponse
        {
            public List<OpenRouterModel>? Data { get; set; }
        }

        /// <summary>
        /// Model class for OpenRouter model
        /// </summary>
        private class OpenRouterModel
        {
            public string Id { get; set; } = string.Empty;
            public string? Name { get; set; }
            public string? Description { get; set; }
            public int? Context_Length { get; set; }
            public string? Provider { get; set; }
            public OpenRouterModelPricing? Pricing { get; set; }
        }

        /// <summary>
        /// Pricing information for OpenRouter model
        /// </summary>
        private class OpenRouterModelPricing
        {
            public double? Prompt { get; set; }
            public double? Completion { get; set; }
        }
    }
}
