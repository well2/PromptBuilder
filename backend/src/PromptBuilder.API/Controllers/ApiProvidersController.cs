using Microsoft.AspNetCore.Mvc;
using PromptBuilder.Core.DTOs;
using PromptBuilder.Core.Interfaces;

namespace PromptBuilder.API.Controllers
{
    /// <summary>
    /// Controller for managing API providers
    /// </summary>
    [ApiController]
    [Route("api/providers")]
    public class ApiProvidersController : ControllerBase
    {
        private readonly IApiProviderService _apiProviderService;
        private readonly ILogger<ApiProvidersController> _logger;
        
        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="apiProviderService">API provider service</param>
        /// <param name="logger">Logger</param>
        public ApiProvidersController(IApiProviderService apiProviderService, ILogger<ApiProvidersController> logger)
        {
            _apiProviderService = apiProviderService;
            _logger = logger;
        }
        
        /// <summary>
        /// Get all API providers
        /// </summary>
        /// <returns>Collection of API provider DTOs</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ApiProviderDto>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<ApiProviderDto>>> GetAllProviders()
        {
            var providers = await _apiProviderService.GetAllProvidersAsync();
            return Ok(providers);
        }
        
        /// <summary>
        /// Get API provider by ID
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>API provider DTO</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiProviderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiProviderDto>> GetProviderById(int id)
        {
            var provider = await _apiProviderService.GetProviderByIdAsync(id);
            if (provider == null)
            {
                return NotFound();
            }
            
            return Ok(provider);
        }
        
        /// <summary>
        /// Get the default API provider
        /// </summary>
        /// <returns>Default API provider DTO</returns>
        [HttpGet("default")]
        [ProducesResponseType(typeof(ApiProviderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiProviderDto>> GetDefaultProvider()
        {
            var provider = await _apiProviderService.GetDefaultProviderAsync();
            if (provider == null)
            {
                return NotFound();
            }
            
            return Ok(provider);
        }
        
        /// <summary>
        /// Create a new API provider
        /// </summary>
        /// <param name="providerDto">Provider DTO to create</param>
        /// <returns>Created provider DTO</returns>
        [HttpPost]
        [ProducesResponseType(typeof(ApiProviderDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiProviderDto>> CreateProvider(CreateApiProviderDto providerDto)
        {
            try
            {
                var createdProvider = await _apiProviderService.CreateProviderAsync(providerDto);
                return CreatedAtAction(nameof(GetProviderById), new { id = createdProvider.Id }, createdProvider);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating API provider");
                return BadRequest(ex.Message);
            }
        }
        
        /// <summary>
        /// Update an existing API provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <param name="providerDto">Provider DTO with updated values</param>
        /// <returns>Updated provider DTO</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiProviderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiProviderDto>> UpdateProvider(int id, UpdateApiProviderDto providerDto)
        {
            try
            {
                var updatedProvider = await _apiProviderService.UpdateProviderAsync(id, providerDto);
                return Ok(updatedProvider);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating API provider");
                return BadRequest(ex.Message);
            }
        }
        
        /// <summary>
        /// Delete an API provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>No content</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteProvider(int id)
        {
            var result = await _apiProviderService.DeleteProviderAsync(id);
            if (!result)
            {
                return NotFound();
            }
            
            return NoContent();
        }
        
        /// <summary>
        /// Get available models for a provider
        /// </summary>
        /// <param name="id">Provider ID</param>
        /// <returns>Collection of model DTOs</returns>
        [HttpGet("{id}/models")]
        [ProducesResponseType(typeof(IEnumerable<LlmModelDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<LlmModelDto>>> GetAvailableModels(int id)
        {
            try
            {
                var models = await _apiProviderService.GetAvailableModelsAsync(id);
                return Ok(models);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting available models");
                return BadRequest(ex.Message);
            }
        }
    }
}
