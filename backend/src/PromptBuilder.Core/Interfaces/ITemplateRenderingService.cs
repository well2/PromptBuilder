using System.Text.Json;

namespace PromptBuilder.Core.Interfaces
{
    /// <summary>
    /// Service for rendering templates with input values
    /// </summary>
    public interface ITemplateRenderingService
    {
        /// <summary>
        /// Render a template with the provided input values
        /// </summary>
        /// <param name="template">Template string in Jinja2-style format</param>
        /// <param name="input">Input values as JSON</param>
        /// <returns>Rendered template</returns>
        string RenderTemplate(string template, JsonDocument input);
    }
}
