using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
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
        private readonly string _apiType;
        private readonly string _apiKey;
        private readonly string _apiUrl;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="httpClient">HTTP client</param>
        /// <param name="configuration">Application configuration</param>
        public LlmService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            
            // Get configuration values
            _apiType = _configuration["LlmService:ApiType"] ?? "OpenRouter";
            _apiKey = _configuration["LlmService:ApiKey"] ?? throw new ArgumentNullException("LlmService:ApiKey is not configured");
            _apiUrl = _configuration["LlmService:ApiUrl"] ?? throw new ArgumentNullException("LlmService:ApiUrl is not configured");
        }
        
        /// <inheritdoc/>
        public async Task<string> GetCompletionAsync(string prompt, string model)
        {
            // Set up the request based on the API type
            if (_apiType.Equals("LiteLLM", StringComparison.OrdinalIgnoreCase))
            {
                return await GetLiteLlmCompletionAsync(prompt, model);
            }
            else // Default to OpenRouter
            {
                return await GetOpenRouterCompletionAsync(prompt, model);
            }
        }
        
        /// <summary>
        /// Get a completion from LiteLLM
        /// </summary>
        /// <param name="prompt">The prompt to send</param>
        /// <param name="model">The model to use</param>
        /// <returns>Response from the LLM</returns>
        private async Task<string> GetLiteLlmCompletionAsync(string prompt, string model)
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
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            
            // Send the request
            var response = await _httpClient.PostAsJsonAsync(_apiUrl, request);
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
        /// <returns>Response from the LLM</returns>
        private async Task<string> GetOpenRouterCompletionAsync(string prompt, string model)
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
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
            _httpClient.DefaultRequestHeaders.Add("HTTP-Referer", "https://promptbuilder.app");
            
            // Send the request
            var response = await _httpClient.PostAsJsonAsync(_apiUrl, request);
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
