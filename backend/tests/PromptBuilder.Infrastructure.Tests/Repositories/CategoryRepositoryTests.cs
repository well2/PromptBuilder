using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;
using PromptBuilder.Infrastructure.Repositories;
using Xunit;

namespace PromptBuilder.Infrastructure.Tests.Repositories
{
    public class CategoryRepositoryTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        
        public CategoryRepositoryTests()
        {
            // Use in-memory database for testing
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "PromptBuilderTestDb_" + Guid.NewGuid().ToString())
                .Options;
            
            // Seed the database
            using (var context = new ApplicationDbContext(_options))
            {
                // Add a prompt template
                var template = new PromptTemplate
                {
                    Id = 1,
                    Name = "Test Template",
                    Template = "Test {{input}}",
                    Model = "gpt-4"
                };
                context.PromptTemplates.Add(template);
                
                // Add categories
                var rootCategory1 = new Category
                {
                    Id = 1,
                    Name = "Root Category 1",
                    PromptTemplateId = 1
                };
                
                var rootCategory2 = new Category
                {
                    Id = 2,
                    Name = "Root Category 2",
                    PromptTemplateId = 1
                };
                
                var childCategory1 = new Category
                {
                    Id = 3,
                    Name = "Child Category 1",
                    ParentId = 1,
                    PromptTemplateId = 1
                };
                
                var childCategory2 = new Category
                {
                    Id = 4,
                    Name = "Child Category 2",
                    ParentId = 1,
                    PromptTemplateId = 1
                };
                
                context.Categories.AddRange(rootCategory1, rootCategory2, childCategory1, childCategory2);
                context.SaveChanges();
            }
        }
        
        [Fact]
        public async Task GetCategoryTreeAsync_ReturnsRootCategoriesWithChildren()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var repository = new CategoryRepository(context);
            
            // Act
            var result = await repository.GetCategoryTreeAsync();
            var categories = result.ToList();
            
            // Assert
            Assert.Equal(2, categories.Count); // Two root categories
            Assert.Equal("Root Category 1", categories[0].Name);
            Assert.Equal("Root Category 2", categories[1].Name);
            
            // Check children of first root category
            Assert.Equal(2, categories[0].Children?.Count);
            Assert.Contains(categories[0].Children!, c => c.Name == "Child Category 1");
            Assert.Contains(categories[0].Children!, c => c.Name == "Child Category 2");
            
            // Check second root category has no children
            Assert.Empty(categories[1].Children!);
        }
        
        [Fact]
        public async Task GetCategoryWithTemplateAsync_ReturnsCategoryWithTemplate()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var repository = new CategoryRepository(context);
            
            // Act
            var result = await repository.GetCategoryWithTemplateAsync(1);
            
            // Assert
            Assert.NotNull(result);
            Assert.Equal("Root Category 1", result.Name);
            Assert.NotNull(result.PromptTemplate);
            Assert.Equal("Test Template", result.PromptTemplate!.Name);
            Assert.Equal("Test {{input}}", result.PromptTemplate.Template);
            Assert.Equal("gpt-4", result.PromptTemplate.Model);
        }
    }
}
