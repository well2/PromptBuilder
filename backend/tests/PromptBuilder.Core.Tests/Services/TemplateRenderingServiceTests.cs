using System.Text.Json;
using PromptBuilder.Core.Services;
using Xunit;

namespace PromptBuilder.Core.Tests.Services
{
    public class TemplateRenderingServiceTests
    {
        [Fact]
        public void RenderTemplate_WithValidTemplate_ReturnsRenderedTemplate()
        {
            // Arrange
            var service = new TemplateRenderingService();
            var template = "Hello, {{name}}! Your language is {{language}}.";
            var input = JsonDocument.Parse("{\"name\":\"John\",\"language\":\"C#\"}");
            
            // Act
            var result = service.RenderTemplate(template, input);
            
            // Assert
            Assert.Equal("Hello, John! Your language is C#.", result);
        }
        
        [Fact]
        public void RenderTemplate_WithNestedObjects_ReturnsRenderedTemplate()
        {
            // Arrange
            var service = new TemplateRenderingService();
            var template = "Project: {{project.name}}, Language: {{project.details.language}}";
            var input = JsonDocument.Parse("{\"project\":{\"name\":\"PromptBuilder\",\"details\":{\"language\":\"C#\"}}}");
            
            // Act
            var result = service.RenderTemplate(template, input);
            
            // Assert
            Assert.Equal("Project: PromptBuilder, Language: C#", result);
        }
        
        [Fact]
        public void RenderTemplate_WithArrays_ReturnsRenderedTemplate()
        {
            // Arrange
            var service = new TemplateRenderingService();
            var template = "{{ for item in items }}{{ item }}{{ if !for.last }}, {{ end }}{{ end }}";
            var input = JsonDocument.Parse("{\"items\":[\"one\",\"two\",\"three\"]}");
            
            // Act
            var result = service.RenderTemplate(template, input);
            
            // Assert
            Assert.Equal("one, two, three", result);
        }
    }
}
