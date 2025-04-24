using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace PromptBuilder.API.Controllers
{
    /// <summary>
    /// Controller for data management operations (export, import, reset)
    /// </summary>
    [ApiController]
    [Route("api/data")]
    public class DataManagementController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly ILogger<DataManagementController> _logger;

        /// <summary>
        /// Constructor for DataManagementController
        /// </summary>
        /// <param name="dbContext">Database context</param>
        /// <param name="logger">Logger</param>
        public DataManagementController(ApplicationDbContext dbContext, ILogger<DataManagementController> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        /// <summary>
        /// Export all data from the database to JSON
        /// </summary>
        /// <returns>JSON file with all data</returns>
        [HttpGet("export")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        public async Task<IActionResult> ExportData()
        {
            try
            {
                // Get all data from the database with no tracking and no navigation properties
                var templates = await _dbContext.PromptTemplates
                    .AsNoTracking()
                    .Select(t => new PromptTemplateExport
                    {
                        Id = t.Id,
                        Name = t.Name,
                        Template = t.Template,
                        Model = t.Model
                    })
                    .ToListAsync();
                
                var categories = await _dbContext.Categories
                    .AsNoTracking()
                    .Select(c => new CategoryExport
                    {
                        Id = c.Id,
                        Name = c.Name,
                        ParentId = c.ParentId,
                        PromptTemplateId = c.PromptTemplateId
                    })
                    .ToListAsync();
                
                var apiProviders = await _dbContext.ApiProviders
                    .AsNoTracking()
                    .Select(p => new ApiProviderExport
                    {
                        Id = p.Id,
                        Name = p.Name,
                        ProviderType = p.ProviderType,
                        ApiKey = p.ApiKey,
                        ApiUrl = p.ApiUrl,
                        IsDefault = p.IsDefault,
                        ConfigOptions = p.ConfigOptions
                    })
                    .ToListAsync();

                // Create a data object to export
                var exportData = new ExportData
                {
                    PromptTemplates = templates,
                    Categories = categories,
                    ApiProviders = apiProviders
                };

                // Serialize to JSON
                var jsonOptions = new JsonSerializerOptions
                {
                    WriteIndented = true
                };
                var json = JsonSerializer.Serialize(exportData, jsonOptions);

                // Return as a file
                byte[] bytes = System.Text.Encoding.UTF8.GetBytes(json);
                return File(bytes, "application/json", "promptbuilder_data.json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting data");
                return StatusCode(500, "An error occurred while exporting data");
            }
        }

        /// <summary>
        /// Import data from JSON file
        /// </summary>
        /// <param name="file">JSON file with data</param>
        /// <returns>Result of the import operation</returns>
        [HttpPost("import")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ImportData(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (!file.ContentType.Contains("json"))
            {
                return BadRequest("File must be a JSON file");
            }

            try
            {
                // Read the file
                using var stream = file.OpenReadStream();
                using var reader = new StreamReader(stream);
                var json = await reader.ReadToEndAsync();

                // Deserialize the JSON
                var jsonOptions = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var importData = JsonSerializer.Deserialize<ExportData>(json, jsonOptions);

                if (importData == null)
                {
                    return BadRequest("Invalid JSON format");
                }

                // Begin a transaction
                using var transaction = await _dbContext.Database.BeginTransactionAsync();

                try
                {
                    // Clear existing data
                    await ClearAllData();

                    // Import prompt templates
                    if (importData.PromptTemplates != null)
                    {
                        foreach (var templateExport in importData.PromptTemplates)
                        {
                            var template = new PromptTemplate
                            {
                                Name = templateExport.Name,
                                Template = templateExport.Template,
                                Model = templateExport.Model
                            };
                            await _dbContext.PromptTemplates.AddAsync(template);
                        }
                        await _dbContext.SaveChangesAsync();
                    }

                    // Import API providers
                    if (importData.ApiProviders != null)
                    {
                        foreach (var providerExport in importData.ApiProviders)
                        {
                            var provider = new ApiProvider
                            {
                                Name = providerExport.Name,
                                ProviderType = providerExport.ProviderType,
                                ApiKey = providerExport.ApiKey,
                                ApiUrl = providerExport.ApiUrl,
                                IsDefault = providerExport.IsDefault,
                                ConfigOptions = providerExport.ConfigOptions
                            };
                            await _dbContext.ApiProviders.AddAsync(provider);
                        }
                        await _dbContext.SaveChangesAsync();
                    }

                    // Create a mapping of old template IDs to new template IDs
                    var templateIdMap = new Dictionary<int, int>();
                    var oldTemplates = importData.PromptTemplates?.Select(t => t.Id).ToList() ?? new List<int>();
                    var newTemplates = await _dbContext.PromptTemplates.Select(t => t.Id).ToListAsync();

                    for (int i = 0; i < Math.Min(oldTemplates.Count, newTemplates.Count); i++)
                    {
                        templateIdMap[oldTemplates[i]] = newTemplates[i];
                    }

                    // Import categories
                    if (importData.Categories != null)
                    {
                        // First pass: Add all categories with updated template IDs
                        var categoryIdMap = new Dictionary<int, int>();
                        foreach (var categoryExport in importData.Categories)
                        {
                            var oldId = categoryExport.Id;
                            
                            var category = new Category
                            {
                                Name = categoryExport.Name,
                                ParentId = null // We'll update this in the second pass
                            };
                            
                            // Update the template ID
                            if (categoryExport.PromptTemplateId.HasValue && templateIdMap.ContainsKey(categoryExport.PromptTemplateId.Value))
                            {
                                category.PromptTemplateId = templateIdMap[categoryExport.PromptTemplateId.Value];
                            }
                            else if (categoryExport.PromptTemplateId.HasValue)
                            {
                                category.PromptTemplateId = categoryExport.PromptTemplateId.Value;
                            }
                            
                            await _dbContext.Categories.AddAsync(category);
                            await _dbContext.SaveChangesAsync();
                            
                            // Store the mapping of old ID to new ID
                            categoryIdMap[oldId] = category.Id;
                        }

                        // Second pass: Update parent IDs
                        foreach (var categoryExport in importData.Categories)
                        {
                            if (categoryExport.ParentId.HasValue && categoryIdMap.ContainsKey(categoryExport.ParentId.Value))
                            {
                                var newId = categoryIdMap[categoryExport.Id];
                                var newParentId = categoryIdMap[categoryExport.ParentId.Value];
                                
                                var dbCategory = await _dbContext.Categories.FindAsync(newId);
                                if (dbCategory != null)
                                {
                                    dbCategory.ParentId = newParentId;
                                }
                            }
                        }
                        
                        await _dbContext.SaveChangesAsync();
                    }

                    // Commit the transaction
                    await transaction.CommitAsync();

                    return Ok("Data imported successfully");
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if an error occurs
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error importing data");
                    return StatusCode(500, $"An error occurred while importing data: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing data");
                return StatusCode(500, $"An error occurred while importing data: {ex.Message}");
            }
        }

        /// <summary>
        /// Reset the database by clearing all data
        /// </summary>
        /// <returns>Result of the reset operation</returns>
        [HttpPost("reset")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ResetData()
        {
            try
            {
                await ClearAllData();
                return Ok("Database reset successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resetting database");
                return StatusCode(500, "An error occurred while resetting the database");
            }
        }

        private async Task ClearAllData()
        {
            // Clear categories first (due to foreign key constraints)
            _dbContext.Categories.RemoveRange(_dbContext.Categories);
            await _dbContext.SaveChangesAsync();

            // Clear prompt templates
            _dbContext.PromptTemplates.RemoveRange(_dbContext.PromptTemplates);
            await _dbContext.SaveChangesAsync();

            // Clear API providers
            _dbContext.ApiProviders.RemoveRange(_dbContext.ApiProviders);
            await _dbContext.SaveChangesAsync();
        }
    }

    /// <summary>
    /// Class for exporting data
    /// </summary>
    public class ExportData
    {
        /// <summary>
        /// List of prompt templates
        /// </summary>
        public List<PromptTemplateExport>? PromptTemplates { get; set; }

        /// <summary>
        /// List of categories
        /// </summary>
        public List<CategoryExport>? Categories { get; set; }

        /// <summary>
        /// List of API providers
        /// </summary>
        public List<ApiProviderExport>? ApiProviders { get; set; }
    }

    /// <summary>
    /// Class for exporting prompt templates
    /// </summary>
    public class PromptTemplateExport
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Template { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
    }

    /// <summary>
    /// Class for exporting categories
    /// </summary>
    public class CategoryExport
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public int? PromptTemplateId { get; set; }
    }

    /// <summary>
    /// Class for exporting API providers
    /// </summary>
    public class ApiProviderExport
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string ProviderType { get; set; } = string.Empty;
        public string ApiKey { get; set; } = string.Empty;
        public string ApiUrl { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public string? ConfigOptions { get; set; }
    }
}
