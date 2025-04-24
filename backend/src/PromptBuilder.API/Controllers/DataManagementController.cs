using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;
using System.Text.Json;

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
                // Get all data from the database
                var templates = await _dbContext.PromptTemplates.ToListAsync();
                var categories = await _dbContext.Categories.ToListAsync();
                var apiProviders = await _dbContext.ApiProviders.ToListAsync();

                // Create a data object to export
                var exportData = new
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
                
                var importData = JsonSerializer.Deserialize<ImportData>(json, jsonOptions);

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
                        foreach (var template in importData.PromptTemplates)
                        {
                            // Reset the ID to let the database assign a new one
                            template.Id = 0;
                            await _dbContext.PromptTemplates.AddAsync(template);
                        }
                        await _dbContext.SaveChangesAsync();
                    }

                    // Import API providers
                    if (importData.ApiProviders != null)
                    {
                        foreach (var provider in importData.ApiProviders)
                        {
                            // Reset the ID to let the database assign a new one
                            provider.Id = 0;
                            await _dbContext.ApiProviders.AddAsync(provider);
                        }
                        await _dbContext.SaveChangesAsync();
                    }

                    // Import categories
                    if (importData.Categories != null)
                    {
                        // Create a mapping of old template IDs to new template IDs
                        var templateIdMap = new Dictionary<int, int>();
                        var oldTemplates = importData.PromptTemplates?.Select(t => t.Id).ToList() ?? new List<int>();
                        var newTemplates = await _dbContext.PromptTemplates.Select(t => t.Id).ToListAsync();

                        for (int i = 0; i < Math.Min(oldTemplates.Count, newTemplates.Count); i++)
                        {
                            templateIdMap[oldTemplates[i]] = newTemplates[i];
                        }

                        // First pass: Add all categories with updated template IDs
                        var categoryIdMap = new Dictionary<int, int>();
                        foreach (var category in importData.Categories)
                        {
                            var oldId = category.Id;
                            
                            // Reset the ID to let the database assign a new one
                            category.Id = 0;
                            
                            // Update the template ID
                            if (templateIdMap.ContainsKey(category.PromptTemplateId))
                            {
                                category.PromptTemplateId = templateIdMap[category.PromptTemplateId];
                            }
                            
                            // Temporarily set ParentId to null, we'll update it in the second pass
                            var originalParentId = category.ParentId;
                            category.ParentId = null;
                            
                            await _dbContext.Categories.AddAsync(category);
                            await _dbContext.SaveChangesAsync();
                            
                            // Store the mapping of old ID to new ID
                            categoryIdMap[oldId] = category.Id;
                            
                            // Store the original parent ID for the second pass
                            if (originalParentId.HasValue)
                            {
                                category.ParentId = originalParentId;
                            }
                        }

                        // Second pass: Update parent IDs
                        foreach (var category in importData.Categories)
                        {
                            if (category.ParentId.HasValue && categoryIdMap.ContainsKey(category.ParentId.Value))
                            {
                                var newId = categoryIdMap[category.Id];
                                var newParentId = categoryIdMap[category.ParentId.Value];
                                
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
    /// Class for deserializing imported data
    /// </summary>
    public class ImportData
    {
        /// <summary>
        /// List of prompt templates
        /// </summary>
        public List<PromptTemplate>? PromptTemplates { get; set; }

        /// <summary>
        /// List of categories
        /// </summary>
        public List<Category>? Categories { get; set; }

        /// <summary>
        /// List of API providers
        /// </summary>
        public List<ApiProvider>? ApiProviders { get; set; }
    }
}
