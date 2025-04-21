# PromptBuilder

PromptBuilder is a web application designed to help users create, manage, and utilize prompt templates for various Large Language Models (LLMs). It features a .NET backend API (serving both the API and the frontend) and a React frontend, using an embedded SQLite database.

This README provides instructions for running and deploying the application both **with Docker** and **without Docker**.

---

## Option 1: Using Docker (Recommended for Simplicity)

### Docker Prerequisites

Ensure you have Docker installed on your system:

*   **macOS:** [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
*   **Windows:** [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) (WSL 2 backend recommended)
*   **Linux:** [Docker Engine](https://docs.docker.com/engine/install/)

### Running Locally with Docker

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd PromptBuilder
    ```
2.  **Build the Docker image:**
    ```bash
    docker build -t promptbuilder-app .
    ```
3.  **Run the application container:**
    ```bash
    docker run -p 8080:8080 --name promptbuilder-instance promptbuilder-app
    ```
    *   Use `-d` for detached mode.
4.  **Access:** `http://localhost:8080`
5.  **Stop:** `Ctrl + C` or `docker stop promptbuilder-instance`
6.  **Remove Container:** `docker rm promptbuilder-instance` (Note: Deletes internal SQLite DB unless a volume is mounted).

### Deploying with Docker

Build the image (`docker build`) and run it on the server (`docker run`).

*   **Linux Server:**
    *   Install Docker Engine.
    *   Clone repo, build image.
    *   Run container: `docker run -d -p 8080:8080 --restart always --name promptbuilder-instance promptbuilder-app`
    *   (Recommended) Use a volume for DB persistence: `-v /path/on/host/db:/app/promptbuilder.db`
    *   (Recommended) Setup a reverse proxy (Nginx/Apache) for SSL, domain mapping, forwarding to `http://localhost:8080`.
*   **Windows Server:**
    *   Install Docker Desktop.
    *   Clone repo, build image.
    *   Run container: `docker run -d -p 8080:8080 --restart always --name promptbuilder-instance promptbuilder-app`
    *   (Recommended) Use a volume for DB persistence: `-v C:\path\on\host\db:/app/promptbuilder.db`
    *   (Recommended) Setup IIS as a reverse proxy.

### Docker Configuration Notes

*   **Database:** SQLite DB (`promptbuilder.db`) is created inside the container at `/app`. Use volume mounting for persistence.
*   **Frontend API URL:** Set to `/` during build, assuming API is at the same origin.
*   **Backend Environment:** Defaults to `Production`. Override with `-e ASPNETCORE_ENVIRONMENT=Development` if needed.

---

## Option 2: Without Docker

### Prerequisites (Without Docker)

Ensure you have the following installed:

*   **.NET 8 SDK:** [Download .NET](https://dotnet.microsoft.com/download/dotnet/8.0) (Includes the runtime)
*   **Node.js and npm:** [Download Node.js](https://nodejs.org/) (LTS version recommended)
*   **Git:** [Download Git](https://git-scm.com/downloads)

### Running Locally without Docker (macOS, Linux, Windows)

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd PromptBuilder
    ```

2.  **Build the Frontend:**
    ```bash
    cd frontend
    npm install
    npm run build
    cd ..
    ```
    This creates a `dist` folder inside `frontend`.

3.  **Prepare the Backend:**
    *   Ensure the backend project (`backend/src/PromptBuilder.API/PromptBuilder.API.csproj`) is configured to serve static files (this should be the case based on recent changes).
    *   Create the `wwwroot` directory if it doesn't exist:
        ```bash
        # On Linux/macOS
        mkdir -p backend/src/PromptBuilder.API/wwwroot
        # On Windows (Command Prompt)
        mkdir backend\src\PromptBuilder.API\wwwroot
        # On Windows (PowerShell)
        New-Item -ItemType Directory -Force -Path backend/src/PromptBuilder.API/wwwroot
        ```
    *   Copy the frontend build output to the backend's `wwwroot`:
        ```bash
        # On Linux/macOS
        cp -a frontend/dist/. backend/src/PromptBuilder.API/wwwroot/
        # On Windows (Command Prompt)
        xcopy frontend\dist backend\src\PromptBuilder.API\wwwroot /E /I /Y
        # On Windows (PowerShell)
        Copy-Item -Path frontend/dist/* -Destination backend/src/PromptBuilder.API/wwwroot/ -Recurse -Force
        ```

4.  **Run the Backend:**
    ```bash
    cd backend/src/PromptBuilder.API
    dotnet run
    ```
    *   The application will start, apply database migrations (creating `promptbuilder.db` in the `backend/src/PromptBuilder.API` directory if it doesn't exist), and listen typically on `http://localhost:5000` or `https://localhost:5001` (check the console output). The port might differ based on `launchSettings.json`.

5.  **Access the application:**
    Open your browser to the URL provided in the `dotnet run` output (e.g., `http://localhost:5000`).

6.  **Stop the application:**
    Press `Ctrl + C` in the terminal where `dotnet run` is executing.

### Deploying without Docker

#### Linux Server

1.  **Prerequisites:**
    *   Install the **.NET 8 Runtime** (not the full SDK unless you build on the server). [Instructions](https://docs.microsoft.com/en-us/dotnet/core/install/linux)
    *   Install a web server like Nginx or Apache.
2.  **Publish the Application:**
    *   On your development machine (or the server if SDK is installed), navigate to the solution directory (`cd PromptBuilder`) and run:
        ```bash
        dotnet publish backend/src/PromptBuilder.API/PromptBuilder.API.csproj -c Release -o ./publish/backend
        ```
    *   Build the frontend (if not already done):
        ```bash
        cd frontend
        npm install
        npm run build
        cd ..
        ```
    *   Copy the frontend build (`frontend/dist/*`) into the backend publish directory's `wwwroot`:
        ```bash
        # Create wwwroot in publish output
        mkdir -p publish/backend/wwwroot
        # Copy frontend build
        cp -a frontend/dist/. publish/backend/wwwroot/
        ```
3.  **Copy Files to Server:** Transfer the contents of the `./publish/backend` directory to your server (e.g., to `/var/www/promptbuilder`).
4.  **Configure Web Server (Nginx Example):**
    *   Create an Nginx site configuration file (e.g., `/etc/nginx/sites-available/promptbuilder`):
        ```nginx
        server {
            listen 80;
            server_name your_domain.com; # Or server IP

            location / {
                proxy_pass http://localhost:5000; # Assuming Kestrel runs on 5000
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection keep-alive;
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
            }
        }
        ```
    *   Enable the site: `sudo ln -s /etc/nginx/sites-available/promptbuilder /etc/nginx/sites-enabled/`
    *   Test Nginx config: `sudo nginx -t`
    *   Reload Nginx: `sudo systemctl reload nginx`
    *   (Recommended) Configure HTTPS using Let's Encrypt / Certbot.
5.  **Run the Application as a Service (systemd Example):**
    *   Create a service file (e.g., `/etc/systemd/system/promptbuilder.service`):
        ```ini
        [Unit]
        Description=PromptBuilder Web Application

        [Service]
        WorkingDirectory=/var/www/promptbuilder
        ExecStart=/usr/bin/dotnet /var/www/promptbuilder/PromptBuilder.API.dll
        Restart=always
        # Restart service after 10 seconds if dotnet service crashes
        RestartSec=10
        KillSignal=SIGINT
        SyslogIdentifier=promptbuilder
        User=www-data # Or another user with appropriate permissions
        Environment=ASPNETCORE_ENVIRONMENT=Production
        Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
        # Add other environment variables if needed

        [Install]
        WantedBy=multi-user.target
        ```
    *   Enable and start the service:
        ```bash
        sudo systemctl enable promptbuilder.service
        sudo systemctl start promptbuilder.service
        sudo systemctl status promptbuilder.service
        ```
    *   Ensure the `User` (e.g., `www-data`) has write permissions to the application directory if the SQLite DB needs to be created/written to.

#### Windows Server

1.  **Prerequisites:**
    *   Install the **.NET 8 Hosting Bundle**. [Download](https://dotnet.microsoft.com/download/dotnet/8.0) (Installs runtime, IIS module, etc.)
    *   Ensure IIS is installed with the ASP.NET Core Module v2.
2.  **Publish the Application:**
    *   Follow step 2 from the Linux deployment section to publish the backend and copy the frontend build into the `publish/backend/wwwroot` directory.
3.  **Copy Files to Server:** Transfer the contents of `./publish/backend` to a folder on the server (e.g., `C:\inetpub\wwwroot\promptbuilder`).
4.  **Configure IIS:**
    *   Open IIS Manager.
    *   Create a new Application Pool (e.g., "PromptBuilderPool") with ".NET CLR version" set to "No Managed Code".
    *   Create a new Website or Application pointing to the deployment folder (`C:\inetpub\wwwroot\promptbuilder`).
    *   Assign the created Application Pool to the site/application.
    *   Ensure the Application Pool identity has read/write permissions to the deployment folder (for SQLite DB creation/access).
    *   The `web.config` file generated during publish should configure the ASP.NET Core Module correctly.
5.  **Set Environment Variables (Optional):**
    *   You can set environment variables like `ASPNETCORE_ENVIRONMENT=Production` within the IIS Application settings or globally on the server.
6.  **Start Website:** Ensure the website is started in IIS Manager. Access it via the configured binding (e.g., `http://your_server_ip`).

---

*This README provides basic instructions. Specific configurations for web servers, permissions, and environment variables might need adjustments based on your exact server setup and security requirements.*