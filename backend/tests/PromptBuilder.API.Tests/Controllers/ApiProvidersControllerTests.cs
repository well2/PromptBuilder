using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using PromptBuilder.API.Controllers;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using Xunit;

namespace PromptBuilder.API.Tests.Controllers
{
    public class ApiProvidersControllerTests
    {
        private readonly Mock<IApiProviderService> _mockService;
        private readonly Mock<ILogger<ApiProvidersController>> _mockLogger;
        private readonly ApiProvidersController _controller;
        
        public ApiProvidersControllerTests()
        {
            _mockService = new Mock<IApiProviderService>();
            _mockLogger = new Mock<ILogger<ApiProvidersController>>();
            _controller = new ApiProvidersController(_mockService.Object, _mockLogger.Object);
        }
        
        [Fact]
        public async Task GetAllProviders_ShouldReturnOk_WithProviders()
        {
            // Arrange
            var providers = new List<ApiProviderDto>
            {
                new ApiProviderDto { Id = 1, Name = "OpenRouter", ProviderType = "OpenRouter", ApiUrl = "url1", IsDefault = true },
                new ApiProviderDto { Id = 2, Name = "LiteLLM", ProviderType = "LiteLLM", ApiUrl = "url2", IsDefault = false }
            };
            
            _mockService.Setup(s => s.GetAllProvidersAsync()).ReturnsAsync(providers);
            
            // Act
            var result = await _controller.GetAllProviders();
            
            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<ApiProviderDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }
        
        [Fact]
        public async Task GetProviderById_ShouldReturnOk_WhenProviderExists()
        {
            // Arrange
            var provider = new ApiProviderDto { Id = 1, Name = "OpenRouter", ProviderType = "OpenRouter", ApiUrl = "url1", IsDefault = true };
            
            _mockService.Setup(s => s.GetProviderByIdAsync(1)).ReturnsAsync(provider);
            
            // Act
            var result = await _controller.GetProviderById(1);
            
            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<ApiProviderDto>(okResult.Value);
            Assert.Equal(1, returnValue.Id);
            Assert.Equal("OpenRouter", returnValue.Name);
        }
        
        [Fact]
        public async Task GetProviderById_ShouldReturnNotFound_WhenProviderDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetProviderByIdAsync(1)).ReturnsAsync((ApiProviderDto?)null);
            
            // Act
            var result = await _controller.GetProviderById(1);
            
            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
        
        [Fact]
        public async Task CreateProvider_ShouldReturnCreatedAtAction_WithProvider()
        {
            // Arrange
            var createDto = new CreateApiProviderDto
            {
                Name = "OpenRouter",
                ProviderType = "OpenRouter",
                ApiKey = "key1",
                ApiUrl = "url1",
                IsDefault = true
            };
            
            var createdProvider = new ApiProviderDto
            {
                Id = 1,
                Name = "OpenRouter",
                ProviderType = "OpenRouter",
                ApiUrl = "url1",
                IsDefault = true
            };
            
            _mockService.Setup(s => s.CreateProviderAsync(createDto)).ReturnsAsync(createdProvider);
            
            // Act
            var result = await _controller.CreateProvider(createDto);
            
            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<ApiProviderDto>(createdAtActionResult.Value);
            Assert.Equal(1, returnValue.Id);
            Assert.Equal("OpenRouter", returnValue.Name);
            Assert.Equal("GetProviderById", createdAtActionResult.ActionName);
            Assert.Equal(1, createdAtActionResult.RouteValues?["id"]);
        }
        
        [Fact]
        public async Task GetAvailableModels_ShouldReturnOk_WithModels()
        {
            // Arrange
            var models = new List<LlmModelDto>
            {
                new LlmModelDto { Id = "openai/gpt-4", Name = "GPT-4", Provider = "OpenAI" },
                new LlmModelDto { Id = "anthropic/claude-3-opus", Name = "Claude 3 Opus", Provider = "Anthropic" }
            };
            
            _mockService.Setup(s => s.GetAvailableModelsAsync(1)).ReturnsAsync(models);
            
            // Act
            var result = await _controller.GetAvailableModels(1);
            
            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsAssignableFrom<IEnumerable<LlmModelDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count());
        }
        
        [Fact]
        public async Task GetAvailableModels_ShouldReturnNotFound_WhenProviderDoesNotExist()
        {
            // Arrange
            _mockService.Setup(s => s.GetAvailableModelsAsync(1)).ThrowsAsync(new KeyNotFoundException());
            
            // Act
            var result = await _controller.GetAvailableModels(1);
            
            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
    }
}
