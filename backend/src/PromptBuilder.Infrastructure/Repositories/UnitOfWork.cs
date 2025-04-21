using PromptBuilder.Core.Interfaces;
using PromptBuilder.Infrastructure.Data;

namespace PromptBuilder.Infrastructure.Repositories
{
    /// <summary>
    /// Unit of Work implementation for managing transactions
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private ICategoryRepository? _categoryRepository;
        private IPromptTemplateRepository? _promptTemplateRepository;
        private bool _disposed = false;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="context">Database context</param>
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }
        
        /// <inheritdoc/>
        public ICategoryRepository Categories => 
            _categoryRepository ??= new CategoryRepository(_context);
        
        /// <inheritdoc/>
        public IPromptTemplateRepository PromptTemplates => 
            _promptTemplateRepository ??= new PromptTemplateRepository(_context);
        
        /// <inheritdoc/>
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
        
        /// <summary>
        /// Dispose the context and repositories
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        
        /// <summary>
        /// Dispose pattern implementation
        /// </summary>
        /// <param name="disposing">Whether to dispose managed resources</param>
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
                
                _disposed = true;
            }
        }
    }
}
