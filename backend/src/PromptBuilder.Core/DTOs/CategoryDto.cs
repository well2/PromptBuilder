namespace PromptBuilder.Core.DTOs
{
    /// <summary>
    /// Data Transfer Object for Category
    /// </summary>
    public class CategoryDto
    {
        /// <summary>
        /// Unique identifier for the category
        /// </summary>
        public int Id { get; set; }
        
        /// <summary>
        /// Name of the category
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Parent category ID (null for root categories)
        /// </summary>
        public int? ParentId { get; set; }
        
        /// <summary>
        /// ID of the prompt template associated with this category
        /// </summary>
        public int PromptTemplateId { get; set; }
        
        /// <summary>
        /// Child categories
        /// </summary>
        public List<CategoryDto>? Children { get; set; }
    }
    
    /// <summary>
    /// DTO for creating a new category
    /// </summary>
    public class CreateCategoryDto
    {
        /// <summary>
        /// Name of the category
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Parent category ID (null for root categories)
        /// </summary>
        public int? ParentId { get; set; }
        
        /// <summary>
        /// ID of the prompt template associated with this category
        /// </summary>
        public int PromptTemplateId { get; set; }
    }
    
    /// <summary>
    /// DTO for updating an existing category
    /// </summary>
    public class UpdateCategoryDto
    {
        /// <summary>
        /// Name of the category
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// Parent category ID (null for root categories)
        /// </summary>
        public int? ParentId { get; set; }
        
        /// <summary>
        /// ID of the prompt template associated with this category
        /// </summary>
        public int PromptTemplateId { get; set; }
    }
}
