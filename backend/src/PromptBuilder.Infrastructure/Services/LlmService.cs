using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using PromptBuilder.Core.Interfaces;

namespace PromptBuilder.Infrastructure.Services
{
    /// <summary>
    /// Service for interacting with Language Models via LiteLLM or OpenRouter
    /// </summary>
    public class LlmService : ILlmService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly IApiProviderRepository _apiProviderRepository;
        private readonly ILogger<LlmService> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="httpClient">HTTP client</param>
        /// <param name="configuration">Application configuration</param>
        /// <param name="apiProviderRepository">API provider repository</param>
        /// <param name="logger">Logger</param>
        public LlmService(
            HttpClient httpClient,
            IConfiguration configuration,
            IApiProviderRepository apiProviderRepository,
            ILogger<LlmService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _apiProviderRepository = apiProviderRepository;
            _logger = logger;
        }

        /// <inheritdoc/>
        public async Task<string> GetCompletionAsync(string prompt, string model)
        {
            // Get the default API provider
            var provider = await _apiProviderRepository.GetDefaultAsync();

            if (provider == null)
            {
                _logger.LogWarning("No default API provider found. Using configuration values.");

                // Fall back to configuration values
                string apiType = _configuration["LlmService:ApiType"] ?? "OpenRouter";
                string apiKey = _configuration["LlmService:ApiKey"] ?? throw new ArgumentNullException("LlmService:ApiKey is not configured");
                string apiUrl = _configuration["LlmService:ApiUrl"] ?? throw new ArgumentNullException("LlmService:ApiUrl is not configured");

                // Set up the request based on the API type from configuration
                if (apiType.Equals("LiteLLM", StringComparison.OrdinalIgnoreCase))
                {
                    return await GetLiteLlmCompletionAsync(prompt, model, apiKey, apiUrl);
                }
                else // Default to OpenRouter
                {
                    return await GetOpenRouterCompletionAsync(prompt, model, apiKey, apiUrl);
                }
            }

            // Set up the request based on the provider type
            if (provider.ProviderType.Equals("LiteLLM", StringComparison.OrdinalIgnoreCase))
            {
                return await GetLiteLlmCompletionAsync(prompt, model, provider.ApiKey, provider.ApiUrl);
            }
            else // Default to OpenRouter
            {
                return await GetOpenRouterCompletionAsync(prompt, model, provider.ApiKey, provider.ApiUrl);
            }
        }

        /// <summary>
        /// Get a completion from LiteLLM
        /// </summary>
        /// <param name="prompt">The prompt to send</param>
        /// <param name="model">The model to use</param>
        /// <param name="apiKey">API key to use</param>
        /// <param name="apiUrl">API URL to use</param>
        /// <returns>Response from the LLM</returns>
        private async Task<string> GetLiteLlmCompletionAsync(string prompt, string model, string apiKey, string apiUrl)
        {
            // Set up the request
            var request = new
            {
                model = model,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            // Set up the headers
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

            // Send the request
            var response = await _httpClient.PostAsJsonAsync(apiUrl, request);
            response.EnsureSuccessStatusCode();

            // Parse the response
            var responseContent = await response.Content.ReadFromJsonAsync<JsonDocument>();

            if (responseContent == null)
            {
                throw new InvalidOperationException("Failed to parse LiteLLM response");
            }

            // Extract the completion text
            if (responseContent.RootElement.TryGetProperty("choices", out var choices) &&
                choices.GetArrayLength() > 0 &&
                choices[0].TryGetProperty("message", out var message) &&
                message.TryGetProperty("content", out var content))
            {
                return content.GetString() ?? string.Empty;
            }

            throw new InvalidOperationException("Failed to extract completion from LiteLLM response");
        }

        /// <summary>
        /// Get a completion from OpenRouter
        /// </summary>
        /// <param name="prompt">The prompt to send</param>
        /// <param name="model">The model to use</param>
        /// <param name="apiKey">API key to use</param>
        /// <param name="apiUrl">API URL to use</param>
        /// <returns>Response from the LLM</returns>
        private async Task<string> GetOpenRouterCompletionAsync(string prompt, string model, string apiKey, string apiUrl)
        {
            // Set up the request
            var request = new
            {
                model = model,
                messages = new[]
                {
                    new { role = "user", content = prompt }
                }
            };

            // Set up the headers
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://promptbuilder.app");

            // Send the request
            var response = await _httpClient.PostAsJsonAsync(apiUrl, request);
            response.EnsureSuccessStatusCode();

            // Parse the response
            var responseContent = await response.Content.ReadFromJsonAsync<JsonDocument>();

            if (responseContent == null)
            {
                throw new InvalidOperationException("Failed to parse OpenRouter response");
            }

            // Extract the completion text
            if (responseContent.RootElement.TryGetProperty("choices", out var choices) &&
                choices.GetArrayLength() > 0 &&
                choices[0].TryGetProperty("message", out var message) &&
                message.TryGetProperty("content", out var content))
            {
                return content.GetString() ?? string.Empty;
            }

            throw new InvalidOperationException("Failed to extract completion from OpenRouter response");
        }
    }
}
