using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;

namespace PromptBuilder.Infrastructure.Repositories
{
    /// <summary>
    /// Repository implementation for API Providers
    /// </summary>
    public class ApiProviderRepository : IApiProviderRepository
    {
        private readonly ApplicationDbContext _context;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context</param>
        public ApiProviderRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        
        /// <inheritdoc/>
        public async Task<IEnumerable<ApiProvider>> GetAllAsync()
        {
            return await _context.ApiProviders.ToListAsync();
        }
        
        /// <inheritdoc/>
        public async Task<ApiProvider?> GetByIdAsync(int id)
        {
            return await _context.ApiProviders.FindAsync(id);
        }
        
        /// <inheritdoc/>
        public async Task<ApiProvider?> GetDefaultAsync()
        {
            return await _context.ApiProviders
                .FirstOrDefaultAsync(p => p.IsDefault);
        }
        
        /// <inheritdoc/>
        public async Task<ApiProvider> AddAsync(ApiProvider provider)
        {
            // If this provider is set as default, unset any existing default
            if (provider.IsDefault)
            {
                await UnsetDefaultAsync();
            }
            
            _context.ApiProviders.Add(provider);
            await _context.SaveChangesAsync();
            return provider;
        }
        
        /// <inheritdoc/>
        public async Task<ApiProvider> UpdateAsync(ApiProvider provider)
        {
            // If this provider is set as default, unset any existing default
            if (provider.IsDefault)
            {
                await UnsetDefaultAsync(provider.Id);
            }
            
            _context.Entry(provider).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return provider;
        }
        
        /// <inheritdoc/>
        public async Task<bool> DeleteAsync(int id)
        {
            var provider = await _context.ApiProviders.FindAsync(id);
            if (provider == null)
            {
                return false;
            }
            
            _context.ApiProviders.Remove(provider);
            await _context.SaveChangesAsync();
            return true;
        }
        
        /// <summary>
        /// Unset the default flag on all providers except the specified one
        /// </summary>
        /// <param name="exceptId">ID of provider to exclude from update</param>
        private async Task UnsetDefaultAsync(int? exceptId = null)
        {
            var defaultProviders = await _context.ApiProviders
                .Where(p => p.IsDefault && (exceptId == null || p.Id != exceptId))
                .ToListAsync();
                
            foreach (var provider in defaultProviders)
            {
                provider.IsDefault = false;
                _context.Entry(provider).State = EntityState.Modified;
            }
            
            await _context.SaveChangesAsync();
        }
    }
}
