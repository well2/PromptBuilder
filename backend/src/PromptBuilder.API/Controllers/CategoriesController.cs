using Microsoft.AspNetCore.Mvc;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;

namespace PromptBuilder.API.Controllers
{
    /// <summary>
    /// Controller for managing categories
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CategoriesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="unitOfWork">Unit of work</param>
        public CategoriesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        /// <summary>
        /// Get all categories as a tree structure
        /// </summary>
        /// <returns>List of root categories with their children</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<CategoryDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _unitOfWork.Categories.GetCategoryTreeAsync();
            var categoryDtos = MapCategoriesToDtos(categories);
            return Ok(categoryDtos);
        }
        
        /// <summary>
        /// Get a category by ID
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>Category or 404 if not found</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategory(int id)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }
            
            return Ok(MapCategoryToDto(category));
        }
        
        /// <summary>
        /// Create a new category
        /// </summary>
        /// <param name="createCategoryDto">Category data</param>
        /// <returns>Created category</returns>
        [HttpPost]
        [ProducesResponseType(typeof(CategoryDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            // Validate that the prompt template exists
            var promptTemplate = await _unitOfWork.PromptTemplates.GetByIdAsync(createCategoryDto.PromptTemplateId);
            if (promptTemplate == null)
            {
                return BadRequest($"Prompt template with ID {createCategoryDto.PromptTemplateId} does not exist");
            }
            
            // Validate that the parent category exists if specified
            if (createCategoryDto.ParentId.HasValue)
            {
                var parentCategory = await _unitOfWork.Categories.GetByIdAsync(createCategoryDto.ParentId.Value);
                if (parentCategory == null)
                {
                    return BadRequest($"Parent category with ID {createCategoryDto.ParentId} does not exist");
                }
            }
            
            // Create the category
            var category = new Category
            {
                Name = createCategoryDto.Name,
                ParentId = createCategoryDto.ParentId,
                PromptTemplateId = createCategoryDto.PromptTemplateId
            };
            
            await _unitOfWork.Categories.AddAsync(category);
            await _unitOfWork.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, MapCategoryToDto(category));
        }
        
        /// <summary>
        /// Update an existing category
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <param name="updateCategoryDto">Updated category data</param>
        /// <returns>No content if successful, 404 if not found</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateCategory(int id, UpdateCategoryDto updateCategoryDto)
        {
            var category = await _unitOfWork.Categories.GetByIdAsync(id);
            
            if (category == null)
            {
                return NotFound();
            }
            
            // Validate that the prompt template exists
            var promptTemplate = await _unitOfWork.PromptTemplates.GetByIdAsync(updateCategoryDto.PromptTemplateId);
            if (promptTemplate == null)
            {
                return BadRequest($"Prompt template with ID {updateCategoryDto.PromptTemplateId} does not exist");
            }
            
            // Validate that the parent category exists if specified
            if (updateCategoryDto.ParentId.HasValue)
            {
                // Prevent circular references
                if (updateCategoryDto.ParentId.Value == id)
                {
                    return BadRequest("A category cannot be its own parent");
                }
                
                var parentCategory = await _unitOfWork.Categories.GetByIdAsync(updateCategoryDto.ParentId.Value);
                if (parentCategory == null)
                {
                    return BadRequest($"Parent category with ID {updateCategoryDto.ParentId} does not exist");
                }
            }
            
            // Update the category
            category.Name = updateCategoryDto.Name;
            category.ParentId = updateCategoryDto.ParentId;
            category.PromptTemplateId = updateCategoryDto.PromptTemplateId;
            
            _unitOfWork.Categories.Update(category);
            await _unitOfWork.SaveChangesAsync();
            
            return NoContent();
        }
        
        /// <summary>
        /// Delete a category
        /// </summary>
        /// <param name="id">Category ID</param>
        /// <returns>No content if successful, 404 if not found</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            // Check if the category has children
            var allCategories = await _unitOfWork.Categories.GetAllAsync();
            var hasChildren = allCategories.Any(c => c.ParentId == id);
            
            if (hasChildren)
            {
                return BadRequest("Cannot delete a category that has child categories");
            }
            
            var result = await _unitOfWork.Categories.DeleteByIdAsync(id);
            
            if (!result)
            {
                return NotFound();
            }
            
            await _unitOfWork.SaveChangesAsync();
            
            return NoContent();
        }
        
        /// <summary>
        /// Map a list of Category entities to CategoryDto objects
        /// </summary>
        /// <param name="categories">Categories to map</param>
        /// <returns>List of CategoryDto objects</returns>
        private List<CategoryDto> MapCategoriesToDtos(IEnumerable<Category> categories)
        {
            var result = new List<CategoryDto>();
            
            foreach (var category in categories)
            {
                result.Add(MapCategoryToDto(category));
            }
            
            return result;
        }
        
        /// <summary>
        /// Map a Category entity to a CategoryDto object
        /// </summary>
        /// <param name="category">Category to map</param>
        /// <returns>CategoryDto object</returns>
        private CategoryDto MapCategoryToDto(Category category)
        {
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                ParentId = category.ParentId,
                PromptTemplateId = category.PromptTemplateId,
                Children = category.Children != null ? MapCategoriesToDtos(category.Children) : null
            };
        }
    }
}
