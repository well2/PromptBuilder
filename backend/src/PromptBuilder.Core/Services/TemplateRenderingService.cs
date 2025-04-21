using System.Text.Json;
using PromptBuilder.Core.Interfaces;
using Scriban;

namespace PromptBuilder.Core.Services
{
    /// <summary>
    /// Service for rendering templates using Scriban
    /// </summary>
    public class TemplateRenderingService : ITemplateRenderingService
    {
        /// <inheritdoc/>
        public string RenderTemplate(string templateText, JsonDocument input)
        {
            // Parse the template
            var template = Template.Parse(templateText);
            
            if (template.HasErrors)
            {
                throw new ArgumentException($"Template parsing error: {string.Join(", ", template.Messages)}");
            }
            
            // Convert JsonDocument to a dictionary for Scriban
            var inputDict = ConvertJsonDocumentToDictionary(input);
            
            // Render the template
            return template.Render(inputDict);
        }
        
        /// <summary>
        /// Convert a JsonDocument to a dictionary that Scriban can use
        /// </summary>
        /// <param name="json">JSON document</param>
        /// <returns>Dictionary representation</returns>
        private Dictionary<string, object?> ConvertJsonDocumentToDictionary(JsonDocument json)
        {
            var result = new Dictionary<string, object?>();
            
            foreach (var property in json.RootElement.EnumerateObject())
            {
                result[property.Name] = ConvertJsonElementToObject(property.Value);
            }
            
            return result;
        }
        
        /// <summary>
        /// Convert a JsonElement to an appropriate .NET object
        /// </summary>
        /// <param name="element">JSON element</param>
        /// <returns>Converted object</returns>
        private object? ConvertJsonElementToObject(JsonElement element)
        {
            switch (element.ValueKind)
            {
                case JsonValueKind.Object:
                    var obj = new Dictionary<string, object?>();
                    foreach (var property in element.EnumerateObject())
                    {
                        obj[property.Name] = ConvertJsonElementToObject(property.Value);
                    }
                    return obj;
                
                case JsonValueKind.Array:
                    var array = new List<object?>();
                    foreach (var item in element.EnumerateArray())
                    {
                        array.Add(ConvertJsonElementToObject(item));
                    }
                    return array;
                
                case JsonValueKind.String:
                    return element.GetString();
                
                case JsonValueKind.Number:
                    if (element.TryGetInt32(out int intValue))
                    {
                        return intValue;
                    }
                    if (element.TryGetInt64(out long longValue))
                    {
                        return longValue;
                    }
                    return element.GetDouble();
                
                case JsonValueKind.True:
                    return true;
                
                case JsonValueKind.False:
                    return false;
                
                case JsonValueKind.Null:
                    return null;
                
                default:
                    return null;
            }
        }
    }
}
