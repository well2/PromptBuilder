using System.Text.Json;

namespace PromptBuilder.Core.DTOs
{
    /// <summary>
    /// DTO for generating a prompt and getting an LLM response
    /// </summary>
    public class GeneratePromptDto
    {
        /// <summary>
        /// ID of the category to use for generating the prompt
        /// </summary>
        public int CategoryId { get; set; }
        
        /// <summary>
        /// Input values to use in the template
        /// </summary>
        public JsonDocument Input { get; set; } = JsonDocument.Parse("{}");
    }
    
    /// <summary>
    /// Response from the LLM after generating a prompt
    /// </summary>
    public class LlmResponseDto
    {
        /// <summary>
        /// The generated prompt that was sent to the LLM
        /// </summary>
        public string GeneratedPrompt { get; set; } = string.Empty;
        
        /// <summary>
        /// The response from the LLM
        /// </summary>
        public string Response { get; set; } = string.Empty;
        
        /// <summary>
        /// The model used for the response
        /// </summary>
        public string Model { get; set; } = string.Empty;
    }
}
