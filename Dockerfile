# Stage 1: Build Frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Set the API base URL for the frontend build (adjust if needed)
# This assumes the backend API will be served from the same origin/port
ENV VITE_API_BASE_URL=/
RUN npm run build

# Stage 2: Build Backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /source

# Copy solution and project files first for layer caching
COPY PromptBuilder.sln .
COPY backend/*.sln ./backend/
COPY backend/src/*/*.csproj ./backend/src/
RUN find ./backend/src -name '*.csproj' -exec dirname {} \; | xargs -I {} cp -r {} ./{}
COPY backend/tests/*/*.csproj ./backend/tests/
RUN find ./backend/tests -name '*.csproj' -exec dirname {} \; | xargs -I {} cp -r {} ./{}

# Restore dependencies
RUN dotnet restore PromptBuilder.sln

# Copy remaining source code
COPY backend/src/ ./backend/src/
COPY backend/tests/ ./backend/tests/

# Publish the API project
WORKDIR /source/backend/src/PromptBuilder.API
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 3: Final Image - Combine Backend and Frontend
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy backend build output
COPY --from=backend-build /app/publish .

# Create wwwroot directory and copy frontend build output into it
COPY --from=frontend-build /app/frontend/dist ./wwwroot

# Ensure the database file path is relative to the app directory
# The connection string "Data Source=promptbuilder.db" will place it in /app
# No specific volume mapping needed unless persistence outside the container is desired

# Expose the port the app runs on (ASP.NET Core default is 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Set the entry point
ENTRYPOINT ["dotnet", "PromptBuilder.API.dll"]