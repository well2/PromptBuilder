using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using PromptBuilder.API.Controllers;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;
using System.Text;
using System.Text.Json;

namespace PromptBuilder.API.Tests.Controllers
{
    public class DataManagementControllerTests
    {
        private readonly Mock<ILogger<DataManagementController>> _loggerMock;
        private readonly ApplicationDbContext _dbContext;
        private readonly DataManagementController _controller;

        public DataManagementControllerTests()
        {
            // Setup in-memory database
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new ApplicationDbContext(options);
            _loggerMock = new Mock<ILogger<DataManagementController>>();
            _controller = new DataManagementController(_dbContext, _loggerMock.Object);

            // Seed test data
            SeedTestData();
        }

        private void SeedTestData()
        {
            // Add test prompt templates
            var template = new PromptTemplate
            {
                Name = "Test Template",
                Template = "This is a {{variable}} template",
                Model = "test-model"
            };
            _dbContext.PromptTemplates.Add(template);
            _dbContext.SaveChanges();

            // Add test categories
            var category = new Category
            {
                Name = "Test Category",
                PromptTemplateId = template.Id
            };
            _dbContext.Categories.Add(category);
            _dbContext.SaveChanges();

            // Add test API provider
            var provider = new ApiProvider
            {
                Name = "Test Provider",
                ProviderType = "OpenRouter",
                ApiKey = "test-key",
                ApiUrl = "https://test.com",
                IsDefault = true
            };
            _dbContext.ApiProviders.Add(provider);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task ExportData_ReturnsFileContentResult()
        {
            // Act
            var result = await _controller.ExportData();

            // Assert
            var fileResult = Assert.IsType<FileContentResult>(result);
            Assert.Equal("application/json", fileResult.ContentType);
            Assert.Equal("promptbuilder_data.json", fileResult.FileDownloadName);
            Assert.NotNull(fileResult.FileContents);
            Assert.True(fileResult.FileContents.Length > 0);

            // Verify content
            var json = Encoding.UTF8.GetString(fileResult.FileContents);
            var exportData = JsonSerializer.Deserialize<ExportData>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            Assert.NotNull(exportData);
            Assert.NotNull(exportData.PromptTemplates);
            Assert.NotNull(exportData.Categories);
            Assert.NotNull(exportData.ApiProviders);
            Assert.Single(exportData.PromptTemplates);
            Assert.Single(exportData.Categories);
            Assert.Single(exportData.ApiProviders);
            Assert.Equal("Test Template", exportData.PromptTemplates[0].Name);
            Assert.Equal("Test Category", exportData.Categories[0].Name);
            Assert.Equal("Test Provider", exportData.ApiProviders[0].Name);
        }

        [Fact]
        public async Task ResetData_ClearsAllData()
        {
            // Act
            var result = await _controller.ResetData();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Database reset successfully", okResult.Value);

            // Verify database is empty
            Assert.Empty(await _dbContext.PromptTemplates.ToListAsync());
            Assert.Empty(await _dbContext.Categories.ToListAsync());
            Assert.Empty(await _dbContext.ApiProviders.ToListAsync());
        }

        [Fact]
        public async Task ImportData_WithValidFile_ImportsData()
        {
            // Arrange
            // First, export data to get valid JSON
            var exportResult = await _controller.ExportData();
            var fileResult = Assert.IsType<FileContentResult>(exportResult);
            var json = Encoding.UTF8.GetString(fileResult.FileContents);

            // Clear the database
            await _controller.ResetData();

            // Create a mock file with the exported data
            var stream = new MemoryStream(Encoding.UTF8.GetBytes(json));
            var formFile = new FormFile(stream, 0, stream.Length, "file", "test.json")
            {
                Headers = new HeaderDictionary(),
                ContentType = "application/json"
            };

            // Act
            var result = await _controller.ImportData(formFile);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Data imported successfully", okResult.Value);

            // Verify data was imported
            Assert.Single(await _dbContext.PromptTemplates.ToListAsync());
            Assert.Single(await _dbContext.Categories.ToListAsync());
            Assert.Single(await _dbContext.ApiProviders.ToListAsync());
        }

        private class ExportData
        {
            public List<PromptTemplate>? PromptTemplates { get; set; }
            public List<Category>? Categories { get; set; }
            public List<ApiProvider>? ApiProviders { get; set; }
        }
    }
}
