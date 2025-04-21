using Microsoft.AspNetCore.Mvc;
using Moq;
using PromptBuilder.API.Controllers;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;
using Xunit;

namespace PromptBuilder.API.Tests.Controllers
{
    public class CategoriesControllerTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<ICategoryRepository> _mockCategoryRepository;
        private readonly Mock<IPromptTemplateRepository> _mockTemplateRepository;
        private readonly CategoriesController _controller;
        
        public CategoriesControllerTests()
        {
            _mockCategoryRepository = new Mock<ICategoryRepository>();
            _mockTemplateRepository = new Mock<IPromptTemplateRepository>();
            
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUnitOfWork.Setup(uow => uow.Categories).Returns(_mockCategoryRepository.Object);
            _mockUnitOfWork.Setup(uow => uow.PromptTemplates).Returns(_mockTemplateRepository.Object);
            
            _controller = new CategoriesController(_mockUnitOfWork.Object);
        }
        
        [Fact]
        public async Task GetAllCategories_ReturnsOkResult_WithListOfCategories()
        {
            // Arrange
            var categories = new List<Category>
            {
                new Category { Id = 1, Name = "Category 1", PromptTemplateId = 1, Children = new List<Category>() },
                new Category { Id = 2, Name = "Category 2", PromptTemplateId = 1, Children = new List<Category>() }
            };
            
            _mockCategoryRepository.Setup(repo => repo.GetCategoryTreeAsync())
                .ReturnsAsync(categories);
            
            // Act
            var result = await _controller.GetAllCategories();
            
            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<List<CategoryDto>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
            Assert.Equal("Category 1", returnValue[0].Name);
            Assert.Equal("Category 2", returnValue[1].Name);
        }
        
        [Fact]
        public async Task GetCategory_WithValidId_ReturnsOkResult()
        {
            // Arrange
            var category = new Category
            {
                Id = 1,
                Name = "Test Category",
                PromptTemplateId = 1
            };
            
            _mockCategoryRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(category);
            
            // Act
            var result = await _controller.GetCategory(1);
            
            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = Assert.IsType<CategoryDto>(okResult.Value);
            Assert.Equal(1, returnValue.Id);
            Assert.Equal("Test Category", returnValue.Name);
        }
        
        [Fact]
        public async Task GetCategory_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            _mockCategoryRepository.Setup(repo => repo.GetByIdAsync(999))
                .ReturnsAsync((Category?)null);
            
            // Act
            var result = await _controller.GetCategory(999);
            
            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
        
        [Fact]
        public async Task CreateCategory_WithValidData_ReturnsCreatedAtAction()
        {
            // Arrange
            var createDto = new CreateCategoryDto
            {
                Name = "New Category",
                PromptTemplateId = 1
            };
            
            var template = new PromptTemplate { Id = 1, Name = "Test Template" };
            
            _mockTemplateRepository.Setup(repo => repo.GetByIdAsync(1))
                .ReturnsAsync(template);
            
            _mockUnitOfWork.Setup(uow => uow.SaveChangesAsync())
                .ReturnsAsync(1);
            
            // Act
            var result = await _controller.CreateCategory(createDto);
            
            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            var returnValue = Assert.IsType<CategoryDto>(createdAtActionResult.Value);
            Assert.Equal("New Category", returnValue.Name);
            Assert.Equal(1, returnValue.PromptTemplateId);
            
            _mockCategoryRepository.Verify(repo => repo.AddAsync(It.IsAny<Category>()), Times.Once);
            _mockUnitOfWork.Verify(uow => uow.SaveChangesAsync(), Times.Once);
        }
    }
}
