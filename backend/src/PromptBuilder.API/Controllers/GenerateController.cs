using Microsoft.AspNetCore.Mvc;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;

namespace PromptBuilder.API.Controllers
{
    /// <summary>
    /// Controller for generating prompts and getting LLM responses
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class GenerateController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITemplateRenderingService _templateRenderingService;
        private readonly ILlmService _llmService;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="unitOfWork">Unit of work</param>
        /// <param name="templateRenderingService">Template rendering service</param>
        /// <param name="llmService">LLM service</param>
        public GenerateController(
            IUnitOfWork unitOfWork,
            ITemplateRenderingService templateRenderingService,
            ILlmService llmService)
        {
            _unitOfWork = unitOfWork;
            _templateRenderingService = templateRenderingService;
            _llmService = llmService;
        }
        
        /// <summary>
        /// Generate a prompt and get an LLM response
        /// </summary>
        /// <param name="generatePromptDto">Generation request</param>
        /// <returns>LLM response</returns>
        [HttpPost]
        [ProducesResponseType(typeof(LlmResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Generate(GeneratePromptDto generatePromptDto)
        {
            // Get the category with its template
            var category = await _unitOfWork.Categories.GetCategoryWithTemplateAsync(generatePromptDto.CategoryId);
            
            if (category == null)
            {
                return NotFound($"Category with ID {generatePromptDto.CategoryId} not found");
            }
            
            if (category.PromptTemplate == null)
            {
                return BadRequest($"Category with ID {generatePromptDto.CategoryId} has no associated template");
            }
            
            try
            {
                // Render the template with the input values
                var renderedPrompt = _templateRenderingService.RenderTemplate(
                    category.PromptTemplate.Template,
                    generatePromptDto.Input);
                
                // Get the response from the LLM
                var llmResponse = await _llmService.GetCompletionAsync(
                    renderedPrompt,
                    category.PromptTemplate.Model);
                
                // Return the response
                return Ok(new LlmResponseDto
                {
                    GeneratedPrompt = renderedPrompt,
                    Response = llmResponse,
                    Model = category.PromptTemplate.Model
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest($"Template rendering error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error generating response: {ex.Message}");
            }
        }
    }
}
