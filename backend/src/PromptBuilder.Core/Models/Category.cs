namespace PromptBuilder.Core.Models
{
    /// <summary>
    /// Represents a category in the hierarchical structure
    /// </summary>
    public class Category
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
        /// Reference to the parent category
        /// </summary>
        public Category? Parent { get; set; }
        
        /// <summary>
        /// Child categories
        /// </summary>
        public ICollection<Category>? Children { get; set; }
        
        /// <summary>
        /// ID of the prompt template associated with this category
        /// </summary>
        public int PromptTemplateId { get; set; }
        
        /// <summary>
        /// Reference to the prompt template
        /// </summary>
        public PromptTemplate? PromptTemplate { get; set; }
    }
}
