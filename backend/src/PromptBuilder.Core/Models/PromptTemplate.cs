namespace PromptBuilder.Core.Models
{
    /// <summary>
    /// Represents a prompt template that can be used to generate prompts for LLMs
    /// </summary>
    public class PromptTemplate
    {
        /// <summary>
        /// Unique identifier for the template
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Name of the template
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// The template content in Jinja2-style format
        /// </summary>
        public string Template { get; set; } = string.Empty;
        
        /// <summary>
        /// Default LLM model to use with this template
        /// </summary>
        public string Model { get; set; } = string.Empty;
        
        /// <summary>
        /// Categories that use this template
        /// </summary>
        public ICollection<Category>? Categories { get; set; }
    }
}
