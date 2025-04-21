using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;

namespace PromptBuilder.Infrastructure.Repositories
{
    /// <summary>
    /// Repository implementation for Category entities
    /// </summary>
    public class CategoryRepository : Repository<Category>, ICategoryRepository
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context</param>
        public CategoryRepository(ApplicationDbContext context) : base(context)
        {
        }
        
        /// <inheritdoc/>
        public async Task<IEnumerable<Category>> GetCategoryTreeAsync()
        {
            // Get all categories
            var allCategories = await _context.Categories
                .Include(c => c.Children)
                .ToListAsync();
            
            // Filter to get only root categories (those with no parent)
            var rootCategories = allCategories.Where(c => c.ParentId == null).ToList();
            
            // Build the tree recursively
            BuildCategoryTree(rootCategories, allCategories);
            
            return rootCategories;
        }
        
        /// <inheritdoc/>
        public async Task<Category?> GetCategoryWithTemplateAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.PromptTemplate)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        
        /// <summary>
        /// Recursively build the category tree
        /// </summary>
        /// <param name="categories">Categories to process</param>
        /// <param name="allCategories">All categories from the database</param>
        private void BuildCategoryTree(IEnumerable<Category> categories, IEnumerable<Category> allCategories)
        {
            foreach (var category in categories)
            {
                // Find all children of this category
                category.Children = allCategories.Where(c => c.ParentId == category.Id).ToList();
                
                // Recursively build the tree for children
                if (category.Children.Any())
                {
                    BuildCategoryTree(category.Children, allCategories);
                }
            }
        }
    }
}
