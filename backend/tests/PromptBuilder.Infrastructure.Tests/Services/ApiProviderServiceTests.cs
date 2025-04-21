using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;
using PromptBuilder.Infrastructure.Data;
using PromptBuilder.Infrastructure.Repositories;
using PromptBuilder.Infrastructure.Services;
using Xunit;

namespace PromptBuilder.Infrastructure.Tests.Services
{
    public class ApiProviderServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly HttpClient _httpClient;
        private readonly ApiProviderService _service;
        private readonly ApiProviderRepository _repository;

        public ApiProviderServiceTests()
        {
            // Use in-memory database for testing
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "PromptBuilderTestDb_" + Guid.NewGuid().ToString())
                .Options;

            // Seed the database
            using (var context = new ApplicationDbContext(_options))
            {
                // Add API providers
                var provider1 = new ApiProvider
                {
                    Id = 1,
                    Name = "OpenRouter",
                    ProviderType = "OpenRouter",
                    ApiKey = "key1",
                    ApiUrl = "url1",
                    IsDefault = true
                };

                var provider2 = new ApiProvider
                {
                    Id = 2,
                    Name = "LiteLLM",
                    ProviderType = "LiteLLM",
                    ApiKey = "key2",
                    ApiUrl = "url2",
                    IsDefault = false
                };

                context.ApiProviders.AddRange(provider1, provider2);
                context.SaveChanges();
            }

            // Create a context for the repository
            var dbContext = new ApplicationDbContext(_options);
            _repository = new ApiProviderRepository(dbContext);

            // Create a test HttpClient that returns a predefined response for model fetching
            _httpClient = new HttpClient(new TestHttpMessageHandler());
            _service = new ApiProviderService(_repository, _httpClient);
        }

        // Test HTTP message handler that returns a predefined response
        private class TestHttpMessageHandler : HttpMessageHandler
        {
            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                var response = new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = JsonContent.Create(new
                    {
                        data = new[]
                        {
                            new
                            {
                                id = "openai/gpt-4",
                                name = "GPT-4",
                                description = "OpenAI's GPT-4 model",
                                context_length = 8192,
                                provider = "OpenAI"
                            },
                            new
                            {
                                id = "anthropic/claude-3-opus",
                                name = "Claude 3 Opus",
                                description = "Anthropic's Claude 3 Opus model",
                                context_length = 200000,
                                provider = "Anthropic"
                            }
                        }
                    })
                };

                return Task.FromResult(response);
            }
        }

        [Fact]
        public async Task GetAllProvidersAsync_ShouldReturnAllProviders()
        {
            // Act
            var result = await _service.GetAllProvidersAsync();

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, p => p.Id == 1 && p.Name == "OpenRouter" && p.IsDefault);
            Assert.Contains(result, p => p.Id == 2 && p.Name == "LiteLLM" && !p.IsDefault);
        }

        [Fact]
        public async Task GetProviderByIdAsync_ShouldReturnProvider_WhenExists()
        {
            // Act
            var result = await _service.GetProviderByIdAsync(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Id);
            Assert.Equal("OpenRouter", result.Name);
            Assert.True(result.IsDefault);
        }

        [Fact]
        public async Task GetProviderByIdAsync_ShouldReturnNull_WhenNotExists()
        {
            // Act
            var result = await _service.GetProviderByIdAsync(999); // Non-existent ID

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateProviderAsync_ShouldCreateProvider()
        {
            // Arrange
            var createDto = new CreateApiProviderDto
            {
                Name = "New Provider",
                ProviderType = "OpenRouter",
                ApiKey = "new-key",
                ApiUrl = "new-url",
                IsDefault = false
            };

            // Act
            var result = await _service.CreateProviderAsync(createDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Id); // Should be ID 3 since we already have 2 providers
            Assert.Equal("New Provider", result.Name);
            Assert.False(result.IsDefault);

            // Verify it was added to the database
            using (var context = new ApplicationDbContext(_options))
            {
                var provider = await context.ApiProviders.FindAsync(3);
                Assert.NotNull(provider);
                Assert.Equal("New Provider", provider.Name);
            }
        }

        [Fact]
        public async Task GetAvailableModelsAsync_ShouldReturnModels_ForOpenRouter()
        {
            // Act
            var result = await _service.GetAvailableModelsAsync(1);

            // Assert
            Assert.Equal(2, result.Count());
            Assert.Contains(result, m => m.Id == "openai/gpt-4" && m.Name == "GPT-4");
            Assert.Contains(result, m => m.Id == "anthropic/claude-3-opus" && m.Name == "Claude 3 Opus");
        }
    }
}
