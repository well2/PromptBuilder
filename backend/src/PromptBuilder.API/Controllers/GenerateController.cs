using Microsoft.AspNetCore.Mvc;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;
using System.Text.Json; // Added using directive for JsonSerializer
using Microsoft.Extensions.Logging; // Added using directive for ILogger

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

        private readonly ILogger<GenerateController> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="unitOfWork">Unit of work</param>
        /// <param name="templateRenderingService">Template rendering service</param>
        /// <param name="llmService">LLM service</param>
        /// <param name="logger">Logger</param>
        public GenerateController(
            IUnitOfWork unitOfWork,
            ITemplateRenderingService templateRenderingService,
            ILlmService llmService,
            ILogger<GenerateController> logger)
        {
            _unitOfWork = unitOfWork;
            _templateRenderingService = templateRenderingService;
            _llmService = llmService;
            _logger = logger;
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
                // Render the template with the input values (this will be the 'Generated Prompt' shown in the UI)
                var renderedPrompt = _templateRenderingService.RenderTemplate(
                    category.PromptTemplate.Template,
                    generatePromptDto.Input);

                // Construct the meta prompt for the LLM
                var metaPrompt = $@"You are a meta-prompt generator. Your task is to take a template and user-provided inputs and generate a detailed, effective prompt that can be used to get a desired output from another LLM.

Original Template:
```
{category.PromptTemplate.Template}
```

User Inputs:
```json
{JsonSerializer.Serialize(generatePromptDto.Input, new JsonSerializerOptions { WriteIndented = true })}
```

Based on the Original Template and User Inputs, generate a detailed and effective prompt. The generated prompt should be ready to be used directly with an LLM to get the desired output based on the template and inputs. Do NOT include any conversational text or explanations in your response, only the generated prompt itself.";

                // Get the meta prompt from the LLM
                var generatedMetaPrompt = await _llmService.GetCompletionAsync(
                    metaPrompt, // Send the meta prompt to the LLM
                    category.PromptTemplate.Model); // Use the template's model

                // Return the response, with the generated meta prompt in the Response field
                return Ok(new LlmResponseDto
                {
                    GeneratedPrompt = renderedPrompt, // Keep the original rendered prompt here
                    Response = generatedMetaPrompt, // Put the generated meta prompt here
                    Model = category.PromptTemplate.Model
                });
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Template rendering error");
                return BadRequest($"Template rendering error: {ex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating meta prompt");
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error generating meta prompt: {ex.Message}");
            }
        }
    }
}
