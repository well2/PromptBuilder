namespace PromptBuilder.Core.DTOs
{
    /// <summary>
    /// Data Transfer Object for PromptTemplate
    /// </summary>
    public class PromptTemplateDto
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
    }
    
    /// <summary>
    /// DTO for creating a new prompt template
    /// </summary>
    public class CreatePromptTemplateDto
    {
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
    }
    
    /// <summary>
    /// DTO for updating an existing prompt template
    /// </summary>
    public class UpdatePromptTemplateDto
    {
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
    }
}
