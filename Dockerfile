# Stage 1: Build Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
# Set the API base URL for the frontend build
# This assumes the backend API will be served from the same origin/port
# In development, this would be http://localhost:5062/api
ENV VITE_API_BASE_URL=/api
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /source

# Copy solution and project files first for layer caching
COPY PromptBuilder.sln .
COPY backend/*.sln ./backend/

# Copy project files for proper layer caching
COPY backend/src/PromptBuilder.API/*.csproj ./backend/src/PromptBuilder.API/
COPY backend/src/PromptBuilder.Core/*.csproj ./backend/src/PromptBuilder.Core/
COPY backend/src/PromptBuilder.Infrastructure/*.csproj ./backend/src/PromptBuilder.Infrastructure/

# Copy test project files
COPY backend/tests/PromptBuilder.API.Tests/*.csproj ./backend/tests/PromptBuilder.API.Tests/
COPY backend/tests/PromptBuilder.Core.Tests/*.csproj ./backend/tests/PromptBuilder.Core.Tests/
COPY backend/tests/PromptBuilder.Infrastructure.Tests/*.csproj ./backend/tests/PromptBuilder.Infrastructure.Tests/

# Restore dependencies
RUN dotnet restore PromptBuilder.sln

# Copy remaining source code
COPY backend/src/ ./backend/src/
COPY backend/tests/ ./backend/tests/

# Publish the API project
WORKDIR /source/backend/src/PromptBuilder.API
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Final Image - Combine Backend and Frontend
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy backend build output
COPY --from=backend-build /app/publish .

# Create wwwroot directory and copy frontend build output into it
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Create a file to verify the wwwroot directory is properly mounted
RUN echo "PromptBuilder is running!" > ./wwwroot/test.html

# Ensure the database file path is relative to the app directory
# The connection string "Data Source=promptbuilder.db" will place it in /app
# No specific volume mapping needed unless persistence outside the container is desired

# Expose the port the app runs on (port 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Set the entry point
ENTRYPOINT ["dotnet", "PromptBuilder.API.dll"]