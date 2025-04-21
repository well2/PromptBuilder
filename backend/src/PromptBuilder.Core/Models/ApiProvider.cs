namespace PromptBuilder.Core.Models
{
    /// <summary>
    /// Represents an API provider for LLM services
    /// </summary>
    public class ApiProvider
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
        /// Type of the API provider (OpenRouter)
        /// </summary>
        public string ProviderType { get; set; } = "OpenRouter";

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
}
