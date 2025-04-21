namespace PromptBuilder.Core.DTOs
{
    /// <summary>
    /// DTO for API Provider
    /// </summary>
    public class ApiProviderDto
    {
        /// <summary>
        /// Unique identifier for the API provider
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Name of the API provider
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Type of the API provider (e.g., OpenRouter, LiteLLM)
        /// </summary>
        public string ProviderType { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for the API
        /// </summary>
        public string ApiUrl { get; set; } = string.Empty;

        /// <summary>
        /// Whether this is the default provider
        /// </summary>
        public bool IsDefault { get; set; }
    }

    /// <summary>
    /// DTO for creating a new API Provider
    /// </summary>
    public class CreateApiProviderDto
    {
        /// <summary>
        /// Name of the API provider
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Type of the API provider (e.g., OpenRouter, LiteLLM)
        /// </summary>
        public string ProviderType { get; set; } = string.Empty;

        /// <summary>
        /// API key for the provider
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for the API
        /// </summary>
        public string ApiUrl { get; set; } = string.Empty;

        /// <summary>
        /// Whether this is the default provider
        /// </summary>
        public bool IsDefault { get; set; }

        /// <summary>
        /// Additional configuration options as JSON
        /// </summary>
        public string? ConfigOptions { get; set; }
    }

    /// <summary>
    /// DTO for updating an API Provider
    /// </summary>
    public class UpdateApiProviderDto
    {
        /// <summary>
        /// Name of the API provider
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Type of the API provider (e.g., OpenRouter, LiteLLM)
        /// </summary>
        public string ProviderType { get; set; } = string.Empty;

        /// <summary>
        /// API key for the provider
        /// </summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Base URL for the API
        /// </summary>
        public string ApiUrl { get; set; } = string.Empty;

        /// <summary>
        /// Whether this is the default provider
        /// </summary>
        public bool IsDefault { get; set; }

        /// <summary>
        /// Additional configuration options as JSON
        /// </summary>
        public string? ConfigOptions { get; set; }
    }

    /// <summary>
    /// DTO for LLM model information
    /// </summary>
    public class LlmModelDto
    {
        /// <summary>
        /// Model identifier
        /// </summary>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// Display name of the model
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Description of the model
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Context window size
        /// </summary>
        public int? ContextLength { get; set; }

        /// <summary>
        /// Provider of the model
        /// </summary>
        public string? Provider { get; set; }

        /// <summary>
        /// Price per 1M tokens for prompt (input)
        /// </summary>
        public double? PricingPrompt { get; set; }

        /// <summary>
        /// Price per 1M tokens for completion (output)
        /// </summary>
        public double? PricingCompletion { get; set; }
    }
}
