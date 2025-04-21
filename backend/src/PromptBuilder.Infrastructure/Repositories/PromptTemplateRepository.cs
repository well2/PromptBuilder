using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;

namespace PromptBuilder.Infrastructure.Repositories
{
    /// <summary>
    /// Repository implementation for PromptTemplate entities
    /// </summary>
    public class PromptTemplateRepository : Repository<PromptTemplate>, IPromptTemplateRepository
    {
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context</param>
        public PromptTemplateRepository(ApplicationDbContext context) : base(context)
        {
        }
        
        /// <inheritdoc/>
        public async Task<PromptTemplate?> GetTemplateWithCategoriesAsync(int id)
        {
            return await _context.PromptTemplates
                .Include(t => t.Categories)
                .FirstOrDefaultAsync(t => t.Id == id);
        }
    }
}
