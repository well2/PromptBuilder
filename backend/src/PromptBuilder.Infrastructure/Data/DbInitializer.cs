using PromptBuilder.Core.Models;

namespace PromptBuilder.Infrastructure.Data
{
    /// <summary>
    /// Database initializer for seeding initial data
    /// </summary>
    public static class DbInitializer
    {
        /// <summary>
        /// Initialize the database with seed data
        /// </summary>
        /// <param name="context">Database context</param>
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Seed API Providers if none exist
            if (!context.ApiProviders.Any())
            {
                var providers = new List<ApiProvider>
                {
                    new ApiProvider
                    {
                        Name = "OpenRouter",
                        ProviderType = "OpenRouter",
                        ApiKey = "REPLACE_WITH_YOUR_API_KEY", // This should be replaced by the user
                        ApiUrl = "https://openrouter.ai/api/v1",
                        IsDefault = true,
                        ConfigOptions = "{}"
                    }
                };

                context.ApiProviders.AddRange(providers);
                context.SaveChanges();
            }

            // Seed Prompt Templates if none exist
            if (!context.PromptTemplates.Any())
            {
                var templates = new List<PromptTemplate>
                {
                    new PromptTemplate
                    {
                        Name = "Code Generation",
                        Template = "Write a {{language}} function that {{task}}",
                        Model = "anthropic/claude-3-opus-20240229"
                    },
                    new PromptTemplate
                    {
                        Name = "Unit Test",
                        Template = "Write a unit test for a {{language}} function that {{task}}",
                        Model = "anthropic/claude-3-sonnet-20240229"
                    },
                    new PromptTemplate
                    {
                        Name = "Documentation",
                        Template = "Write documentation for a {{language}} function that {{task}}",
                        Model = "anthropic/claude-3-haiku-20240307"
                    }
                };

                context.PromptTemplates.AddRange(templates);
                context.SaveChanges();
            }

            // Seed Categories if none exist
            if (!context.Categories.Any())
            {
                // Get the first template for reference
                var codeGenTemplate = context.PromptTemplates.FirstOrDefault(t => t.Name == "Code Generation");
                var unitTestTemplate = context.PromptTemplates.FirstOrDefault(t => t.Name == "Unit Test");
                var documentationTemplate = context.PromptTemplates.FirstOrDefault(t => t.Name == "Documentation");

                if (codeGenTemplate != null && unitTestTemplate != null && documentationTemplate != null)
                {
                    var categories = new List<Category>
                    {
                        new Category
                        {
                            Name = "Development",
                            PromptTemplateId = codeGenTemplate.Id,
                            ParentId = null
                        }
                    };

                    context.Categories.AddRange(categories);
                    context.SaveChanges();

                    // Add subcategories
                    var devCategory = context.Categories.FirstOrDefault(c => c.Name == "Development");
                    if (devCategory != null)
                    {
                        var subCategories = new List<Category>
                        {
                            new Category
                            {
                                Name = "Code Generation",
                                PromptTemplateId = codeGenTemplate.Id,
                                ParentId = devCategory.Id
                            },
                            new Category
                            {
                                Name = "Unit Testing",
                                PromptTemplateId = unitTestTemplate.Id,
                                ParentId = devCategory.Id
                            },
                            new Category
                            {
                                Name = "Documentation",
                                PromptTemplateId = documentationTemplate.Id,
                                ParentId = devCategory.Id
                            }
                        };

                        context.Categories.AddRange(subCategories);
                        context.SaveChanges();
                    }
                }
            }
        }
    }
}
