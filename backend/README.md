# PromptBuilder Backend

This is the backend API for the PromptBuilder application, built with .NET 8, Entity Framework Core, and SQLite.

## Project Structure

The backend follows a clean architecture approach with the following projects:

- **PromptBuilder.API**: Web API controllers and configuration
- **PromptBuilder.Core**: Domain models, interfaces, and business logic
- **PromptBuilder.Infrastructure**: Data access, repositories, and external services
- **PromptBuilder.*.Tests**: Unit and integration tests for each project

## Getting Started

### Prerequisites

- .NET 8 SDK
- An API key for OpenRouter

### Setup

1. Clone the repository
2. Navigate to the backend directory
3. Update the API key in `appsettings.json` or `appsettings.Development.json`
4. Run the following commands:

```bash
# Restore dependencies
dotnet restore

# Apply database migrations
dotnet ef database update --project src/PromptBuilder.Infrastructure --startup-project src/PromptBuilder.API

# Run the application
dotnet run --project src/PromptBuilder.API
```

5. Open your browser and navigate to `https://localhost:5001` to access the Swagger UI

## API Endpoints

The API provides the following endpoints:

### Categories

- `GET /api/categories`: Get all categories in tree structure
- `GET /api/categories/{id}`: Get category by ID
- `POST /api/categories`: Create new category
- `PUT /api/categories/{id}`: Update category
- `DELETE /api/categories/{id}`: Delete category

### PromptTemplates

- `GET /api/prompttemplates`: Get all prompt templates
- `GET /api/prompttemplates/{id}`: Get prompt template by ID
- `POST /api/prompttemplates`: Create new prompt template
- `PUT /api/prompttemplates/{id}`: Update prompt template
- `DELETE /api/prompttemplates/{id}`: Delete prompt template

### Generate

- `POST /api/generate`: Generate prompt and get LLM response

## Testing

Run the tests with the following command:

```bash
dotnet test
```

## Configuration

The application can be configured through the `appsettings.json` file:

- **ConnectionStrings:DefaultConnection**: SQLite connection string
- **LlmService:ApiType**: Type of LLM API to use (OpenRouter)
- **LlmService:ApiKey**: Your API key
- **LlmService:ApiUrl**: URL of the LLM API

## License

This project is licensed under the MIT License.
