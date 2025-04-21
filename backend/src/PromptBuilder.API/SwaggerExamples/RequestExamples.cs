using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace PromptBuilder.API.SwaggerExamples
{
    /// <summary>
    /// Provides example values for Swagger documentation
    /// </summary>
    public class RequestExamples : IOperationFilter
    {
        /// <summary>
        /// Apply examples to the Swagger operation
        /// </summary>
        /// <param name="operation">Operation to apply examples to</param>
        /// <param name="context">Operation filter context</param>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            if (operation.OperationId == "Generate")
            {
                var generateExample = new OpenApiObject
                {
                    ["categoryId"] = new OpenApiInteger(3),
                    ["input"] = new OpenApiObject
                    {
                        ["language"] = new OpenApiString("C#"),
                        ["task"] = new OpenApiString("Function CalculateVat")
                    }
                };
                
                SetRequestExample(operation, "application/json", generateExample);
            }
            else if (operation.OperationId == "CreatePromptTemplate")
            {
                var templateExample = new OpenApiObject
                {
                    ["name"] = new OpenApiString("Unit Test Template"),
                    ["template"] = new OpenApiString("Write a unit test for a {{language}} function that {{task}}"),
                    ["model"] = new OpenApiString("gpt-4")
                };
                
                SetRequestExample(operation, "application/json", templateExample);
            }
            else if (operation.OperationId == "CreateCategory")
            {
                var categoryExample = new OpenApiObject
                {
                    ["name"] = new OpenApiString("Unit Tests"),
                    ["parentId"] = new OpenApiInteger(2),
                    ["promptTemplateId"] = new OpenApiInteger(1)
                };
                
                SetRequestExample(operation, "application/json", categoryExample);
            }
        }
        
        private static void SetRequestExample(OpenApiOperation operation, string mediaType, IOpenApiAny example)
        {
            if (operation.RequestBody?.Content.ContainsKey(mediaType) == true)
            {
                operation.RequestBody.Content[mediaType].Example = example;
            }
        }
    }
}
