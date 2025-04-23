# Docker Implementation Plan for PromptBuilder

## Overview
This document outlines the implementation plan for containerizing the PromptBuilder application using Docker. The goal is to create a single container that hosts both the .NET backend API and the React frontend, with the backend serving the frontend static files.

## Technology Stack
- Docker
- .NET 8 (backend)
- React (frontend)
- SQLite (database)

## Implementation Steps

### 1. Dockerfile Setup
- [x] Create multi-stage Dockerfile
- [x] Configure frontend build stage
- [x] Configure backend build stage
- [x] Configure final runtime stage

### 2. Frontend Configuration
- [x] Set environment variables for API URL
- [x] Configure build output path
- [x] Ensure proper static file handling

### 3. Backend Configuration
- [x] Configure static file serving
- [x] Set up API routes with proper prefixes
- [x] Configure CORS for development environment
- [x] Implement SPA fallback for client-side routing

### 4. Database Configuration
- [x] Configure SQLite database path
- [x] Implement database initialization
- [x] Set up volume mounting for persistence

### 5. Docker Compose (Optional)
- [ ] Create docker-compose.yml for local development
- [ ] Configure environment variables
- [ ] Set up volume mapping

### 6. Testing
- [x] Test container building
- [x] Test application startup
- [x] Test API endpoints
- [x] Test frontend-backend communication
- [x] Test database persistence

### 7. Documentation
- [x] Document Docker setup in README
- [x] Document environment variables
- [x] Document volume mounting for database persistence
- [x] Document deployment instructions

## Docker Configuration

### Environment Variables
- `VITE_API_BASE_URL`: Set to `/api` in production build
- `ASPNETCORE_URLS`: Set to `http://+:8080` for container port binding
- `ASPNETCORE_ENVIRONMENT`: Set to `Production` by default

### Ports
- Container exposes port 8080
- Mapped to host port 8080 by default

### Volumes
- Optional volume mapping for SQLite database persistence: `/app/promptbuilder.db`

## Deployment Instructions

### Local Development
```bash
# Build the Docker image
docker build -t promptbuilder-app .

# Run the container
docker run -p 8080:8080 --name promptbuilder-instance promptbuilder-app

# Run with database persistence
docker run -p 8080:8080 -v /path/on/host:/app/promptbuilder.db --name promptbuilder-instance promptbuilder-app
```

### Production Deployment
```bash
# Build the Docker image
docker build -t promptbuilder-app .

# Run the container with restart policy
docker run -d -p 8080:8080 --restart always --name promptbuilder-instance promptbuilder-app

# Run with database persistence
docker run -d -p 8080:8080 -v /path/on/host:/app/promptbuilder.db --restart always --name promptbuilder-instance promptbuilder-app
```

## Troubleshooting

### Common Issues
- Frontend cannot communicate with backend API
  - Check that the API routes are properly prefixed with `/api`
  - Ensure the frontend is configured to use the correct API URL
  - Verify that CORS is properly configured

- Database persistence issues
  - Ensure the volume is properly mounted
  - Check file permissions on the host directory

- Container startup issues
  - Check logs with `docker logs promptbuilder-instance`
  - Verify port mappings with `docker ps`
