using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using PromptBuilder.API.SwaggerExamples;
using PromptBuilder.Core.Interfaces;
using PromptBuilder.Core.Services;
using PromptBuilder.Infrastructure.Data;
using PromptBuilder.Infrastructure.Repositories;
using PromptBuilder.Infrastructure.Services;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=promptbuilder.db"));

// Register repositories and services
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ITemplateRenderingService, TemplateRenderingService>();
builder.Services.AddScoped<IApiProviderRepository, ApiProviderRepository>();
builder.Services.AddHttpClient<IApiProviderService, ApiProviderService>();
builder.Services.AddHttpClient<ILlmService, LlmService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .WithExposedHeaders("Content-Disposition");
    });
});

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PromptBuilder API",
        Version = "v1",
        Description = "API for the PromptBuilder application",
        Contact = new OpenApiContact
        {
            Name = "PromptBuilder Team",
            Email = "info@promptbuilder.app",
            Url = new Uri("https://promptbuilder.app")
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }

    // Add operation filter for examples
    c.OperationFilter<RequestExamples>();

    // Use operation IDs from method names
    c.CustomOperationIds(apiDesc =>
    {
        if (apiDesc.ActionDescriptor.RouteValues.TryGetValue("action", out var action))
        {
            return action;
        }
        return apiDesc.RelativePath;
    });
});

var app = builder.Build();

// Initialize the database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated();

        // Seed initial data if needed
        DbInitializer.Initialize(context);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database.");
    }
}

// Configure the HTTP request pipeline.
// Enable Swagger in all environments
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "PromptBuilder API v1");
    c.RoutePrefix = "swagger"; // Set Swagger UI at /swagger
});

// Add a simple middleware to log all requests
app.Use(async (context, next) =>
{
    Console.WriteLine($"Request: {context.Request.Method} {context.Request.Path}");
    await next.Invoke();
    Console.WriteLine($"Response: {context.Response.StatusCode}");
});

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.UseRouting();

// Configure API routes
app.MapControllers();

// Configure static files
app.UseStaticFiles();
app.UseDefaultFiles(); // Serves index.html for root path requests

// Fallback for SPA routing - ensures client-side routes are handled by index.html
// This should be the last middleware in the pipeline
app.MapFallbackToFile("index.html");

app.Run();
