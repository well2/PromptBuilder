namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Unit of Work interface for managing transactions
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        /// <summary>
        /// Repository for categories
        /// </summary>
        ICategoryRepository Categories { get; }
        
        /// <summary>
        /// Repository for prompt templates
        /// </summary>
        IPromptTemplateRepository PromptTemplates { get; }
        
        /// <summary>
        /// Save all changes to the database
        /// </summary>
        /// <returns>Number of affected rows</returns>
        Task<int> SaveChangesAsync();
    }
}
