using Microsoft.AspNetCore.Mvc;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Models;

namespace PromptBuilder.API.Controllers
{
    /// <summary>
    /// Controller for managing prompt templates
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PromptTemplatesController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="unitOfWork">Unit of work</param>
        public PromptTemplatesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        
        /// <summary>
        /// Get all prompt templates
        /// </summary>
        /// <returns>List of prompt templates</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<PromptTemplateDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllPromptTemplates()
        {
            var templates = await _unitOfWork.PromptTemplates.GetAllAsync();
            var templateDtos = templates.Select(MapTemplateToDto);
            return Ok(templateDtos);
        }
        
        /// <summary>
        /// Get a prompt template by ID
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <returns>Prompt template or 404 if not found</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(PromptTemplateDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetPromptTemplate(int id)
        {
            var template = await _unitOfWork.PromptTemplates.GetByIdAsync(id);
            
            if (template == null)
            {
                return NotFound();
            }
            
            return Ok(MapTemplateToDto(template));
        }
        
        /// <summary>
        /// Create a new prompt template
        /// </summary>
        /// <param name="createTemplateDto">Template data</param>
        /// <returns>Created template</returns>
        [HttpPost]
        [ProducesResponseType(typeof(PromptTemplateDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreatePromptTemplate(CreatePromptTemplateDto createTemplateDto)
        {
            var template = new PromptTemplate
            {
                Name = createTemplateDto.Name,
                Template = createTemplateDto.Template,
                Model = createTemplateDto.Model
            };
            
            await _unitOfWork.PromptTemplates.AddAsync(template);
            await _unitOfWork.SaveChangesAsync();
            
            return CreatedAtAction(nameof(GetPromptTemplate), new { id = template.Id }, MapTemplateToDto(template));
        }
        
        /// <summary>
        /// Update an existing prompt template
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <param name="updateTemplateDto">Updated template data</param>
        /// <returns>No content if successful, 404 if not found</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdatePromptTemplate(int id, UpdatePromptTemplateDto updateTemplateDto)
        {
            var template = await _unitOfWork.PromptTemplates.GetByIdAsync(id);
            
            if (template == null)
            {
                return NotFound();
            }
            
            template.Name = updateTemplateDto.Name;
            template.Template = updateTemplateDto.Template;
            template.Model = updateTemplateDto.Model;
            
            _unitOfWork.PromptTemplates.Update(template);
            await _unitOfWork.SaveChangesAsync();
            
            return NoContent();
        }
        
        /// <summary>
        /// Delete a prompt template
        /// </summary>
        /// <param name="id">Template ID</param>
        /// <returns>No content if successful, 404 if not found</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeletePromptTemplate(int id)
        {
            // Check if the template is used by any categories
            var template = await _unitOfWork.PromptTemplates.GetTemplateWithCategoriesAsync(id);
            
            if (template == null)
            {
                return NotFound();
            }
            
            if (template.Categories != null && template.Categories.Any())
            {
                return BadRequest("Cannot delete a template that is used by categories");
            }
            
            _unitOfWork.PromptTemplates.Delete(template);
            await _unitOfWork.SaveChangesAsync();
            
            return NoContent();
        }
        
        /// <summary>
        /// Map a PromptTemplate entity to a PromptTemplateDto object
        /// </summary>
        /// <param name="template">Template to map</param>
        /// <returns>PromptTemplateDto object</returns>
        private PromptTemplateDto MapTemplateToDto(PromptTemplate template)
        {
            return new PromptTemplateDto
            {
                Id = template.Id,
                Name = template.Name,
                Template = template.Template,
                Model = template.Model
            };
        }
    }
}
