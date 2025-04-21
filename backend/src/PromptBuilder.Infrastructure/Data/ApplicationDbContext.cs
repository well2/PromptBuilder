using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Models;

namespace PromptBuilder.Infrastructure.Data
{
    /// <summary>
    /// Entity Framework DbContext for the application
    /// </summary>
    public class ApplicationDbContext : DbContext
    {
        /// <summary>
        /// Constructor for the ApplicationDbContext
        /// </summary>
        /// <param name="options">DbContext options</param>
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        /// <summary>
        /// DbSet for PromptTemplates
        /// </summary>
        public DbSet<PromptTemplate> PromptTemplates { get; set; }

        /// <summary>
        /// DbSet for Categories
        /// </summary>
        public DbSet<Category> Categories { get; set; }

        /// <summary>
        /// DbSet for API Providers
        /// </summary>
        public DbSet<ApiProvider> ApiProviders { get; set; }

        /// <summary>
        /// Configure the model
        /// </summary>
        /// <param name="modelBuilder">ModelBuilder instance</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure PromptTemplate entity
            modelBuilder.Entity<PromptTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Template).IsRequired();
                entity.Property(e => e.Model).IsRequired().HasMaxLength(50);
            });

            // Configure Category entity
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);

                // Configure relationship with parent category
                entity.HasOne(e => e.Parent)
                    .WithMany(e => e.Children)
                    .HasForeignKey(e => e.ParentId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);

                // Configure relationship with prompt template
                entity.HasOne(e => e.PromptTemplate)
                    .WithMany(e => e.Categories)
                    .HasForeignKey(e => e.PromptTemplateId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired();
            });

            // Configure ApiProvider entity
            modelBuilder.Entity<ApiProvider>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ProviderType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.ApiKey).IsRequired();
                entity.Property(e => e.ApiUrl).IsRequired();
                entity.Property(e => e.IsDefault).HasDefaultValue(false);
                entity.Property(e => e.ConfigOptions).IsRequired(false);
            });
        }
    }
}
