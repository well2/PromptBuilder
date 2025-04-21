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

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=promptbuilder.db"));

// Register repositories and services
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ITemplateRenderingService, TemplateRenderingService>();
builder.Services.AddHttpClient<ILlmService, LlmService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
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
        return apiDesc.ActionDescriptor.RouteValues["action"];
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "PromptBuilder API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();
app.MapControllers();

app.Run();
