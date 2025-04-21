# Backend Implementation Plan for PromptBuilder

## Technology Stack
- .NET 8 Web API
- Entity Framework Core with SQLite
- Swagger/OpenAPI for API documentation
- xUnit for unit testing
- Scriban for template rendering (Jinja2-style)
- HttpClient for LLM API integration

## Project Structure
```
/backend
  /src
    /PromptBuilder.API           # Web API project
    /PromptBuilder.Core          # Core business logic
    /PromptBuilder.Infrastructure # Data access, external services
  /tests
    /PromptBuilder.API.Tests     # API tests
    /PromptBuilder.Core.Tests    # Core logic tests
    /PromptBuilder.Infrastructure.Tests # Infrastructure tests
```

## Implementation Steps

### 1. Project Setup
- [x] Create solution and project structure
- [x] Configure SQLite with Entity Framework Core
- [x] Set up Swagger documentation
- [x] Configure dependency injection
- [x] Set up logging

### 2. Data Models
- [x] Create entity models for `PromptTemplate` and `Category`
- [x] Create DTOs for API requests/responses
- [x] Set up Entity Framework DbContext
- [x] Create database migrations

### 3. Repository Layer
- [x] Implement generic repository pattern
- [x] Create repositories for `PromptTemplate` and `Category`
- [x] Implement unit of work pattern

### 4. Service Layer
- [x] Implement template rendering service
- [x] Implement LLM integration service (LiteLLM/OpenRouter)
- [x] Create business logic services

### 5. API Controllers
- [x] Implement Categories controller with CRUD operations
- [x] Implement PromptTemplates controller with CRUD operations
- [x] Implement Generate controller for prompt generation and LLM interaction

### 6. Unit Tests
- [x] Write tests for repositories
- [x] Write tests for services
- [x] Write tests for controllers
- [x] Write tests for template rendering
- [ ] Write tests for LLM integration

### 7. Integration Tests
- [x] Test database operations
- [x] Test API endpoints
- [ ] Test LLM integration

### 8. API Provider Integration
- [x] Create API Provider model and repository
- [x] Implement API Provider service
- [x] Add API Provider controller with CRUD operations
- [x] Integrate OpenRouter model fetching
- [x] Update LLM service to use provider configuration
- [x] Add tests for API Provider components
- [x] Enhance OpenRouter integration with proper headers
- [x] Support model selection from OpenRouter models list
- [x] Implement fallback to configuration when no provider is set

### 9. Documentation
- [x] Complete Swagger documentation
- [x] Add XML comments for API endpoints
- [x] Document setup and configuration process

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories in tree structure
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### PromptTemplates
- `GET /api/prompttemplates` - Get all prompt templates
- `GET /api/prompttemplates/{id}` - Get prompt template by ID
- `POST /api/prompttemplates` - Create new prompt template
- `PUT /api/prompttemplates/{id}` - Update prompt template
- `DELETE /api/prompttemplates/{id}` - Delete prompt template

### Generate
- `POST /api/generate` - Generate prompt and get LLM response

### API Providers
- `GET /api/providers` - Get all API providers
- `GET /api/providers/{id}` - Get API provider by ID
- `POST /api/providers` - Create new API provider
- `PUT /api/providers/{id}` - Update API provider
- `DELETE /api/providers/{id}` - Delete API provider
- `GET /api/providers/{id}/models` - Get available models for a provider
