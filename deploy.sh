#!/bin/bash

# SECWatch Deployment Script
# Works on Mac, Linux, and Windows (WSL)
# This script deploys the SECWatch application to a home server

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
# You can set these via environment variables or edit directly below
# Example: export DEPLOY_USER="myuser" && ./deploy.sh
SERVER_USER="${DEPLOY_USER:-your-username}"
SERVER_HOST="${DEPLOY_HOST:-your-server-ip-or-hostname}"
DEPLOY_PATH="${DEPLOY_PATH:-/opt/secwatch}"
SSH_KEY="${SSH_KEY:-~/.ssh/id_rsa}"

# Application ports
API_PORT="${API_PORT:-5181}"
CLIENT_PORT="${CLIENT_PORT:-80}"

# Detect platform for better error messages
if [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macOS"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if grep -q Microsoft /proc/version 2>/dev/null; then
        PLATFORM="WSL"
    else
        PLATFORM="Linux"
    fi
else
    PLATFORM="Unknown"
fi

echo -e "${GREEN}=== SECWatch Deployment Script ===${NC}"
echo -e "${YELLOW}Platform: ${PLATFORM}${NC}"
echo ""

# Check if running locally or remotely
if [ "$1" == "local" ]; then
    echo -e "${YELLOW}Running local deployment checks...${NC}"
    LOCAL_DEPLOY=true
else
    echo -e "${YELLOW}Preparing remote deployment to ${SERVER_USER}@${SERVER_HOST}${NC}"
    LOCAL_DEPLOY=false
fi

# Function to check prerequisites
check_prerequisites() {
    echo -e "${GREEN}Checking prerequisites...${NC}"
    
    local missing=0
    
    if ! command -v dotnet &> /dev/null; then
        echo -e "${RED}ERROR: .NET SDK not found. Please install .NET 9.0 SDK${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ .NET SDK found${NC}"
    fi
    
    if ! command -v node &> /dev/null; then
        echo -e "${RED}ERROR: Node.js not found. Please install Node.js${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ Node.js found${NC}"
    fi
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}ERROR: Docker not found. Please install Docker${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ Docker found${NC}"
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo -e "${RED}ERROR: Docker Compose not found${NC}"
        missing=1
    else
        echo -e "${GREEN}✓ Docker Compose found${NC}"
    fi
    
    if [ $missing -eq 1 ]; then
        exit 1
    fi
}

# Function to build .NET projects
build_dotnet() {
    echo -e "${GREEN}Building .NET projects...${NC}"
    
    cd API
    
    # Restore and build solution
    dotnet restore SECWatch.sln
    dotnet build SECWatch.sln -c Release --no-restore
    
    # Publish API
    echo -e "${YELLOW}Publishing SECWatch.API...${NC}"
    dotnet publish API/SECWatch.API/SECWatch.API.csproj -c Release -o ../publish/api --no-build
    
    # Publish AlertWorkerService
    echo -e "${YELLOW}Publishing SECWatch.AlertWorkerService...${NC}"
    dotnet publish API/SECWatch.AlertWorkerService/SECWatch.AlertWorkerService.csproj -c Release -o ../publish/worker --no-build
    
    cd ..
    
    echo -e "${GREEN}✓ .NET projects built successfully${NC}"
}

# Function to build React client
build_client() {
    echo -e "${GREEN}Building React client...${NC}"
    
    cd Client
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing npm dependencies...${NC}"
        npm ci
    fi
    
    # Build for production
    npm run build
    
    cd ..
    
    echo -e "${GREEN}✓ React client built successfully${NC}"
}

# Function to load .env file
load_env() {
    if [ -f "deploy/.env" ]; then
        echo -e "${GREEN}Loading environment variables from deploy/.env...${NC}"
        set -a  # Automatically export all variables
        source deploy/.env
        set +a
        echo -e "${GREEN}✓ Environment variables loaded${NC}"
    elif [ -f ".env" ]; then
        echo -e "${GREEN}Loading environment variables from .env...${NC}"
        set -a
        source .env
        set +a
        echo -e "${GREEN}✓ Environment variables loaded${NC}"
    else
        echo -e "${YELLOW}No .env file found. Using environment variables or defaults.${NC}"
        echo -e "${YELLOW}Create deploy/.env from deploy/env.example for production deployment.${NC}"
    fi
}

# Function to create production appsettings from base files
create_production_configs() {
    echo -e "${GREEN}Creating production configuration files from base appsettings...${NC}"
    
    mkdir -p deploy
    
    # Check if envsubst is available
    if ! command -v envsubst &> /dev/null; then
        echo -e "${RED}ERROR: envsubst not found. Please install gettext package.${NC}"
        echo -e "${YELLOW}On Ubuntu/Debian: sudo apt-get install gettext-base${NC}"
        echo -e "${YELLOW}On macOS: brew install gettext${NC}"
        exit 1
    fi
    
    # Process API appsettings.json
    if [ -f "API/SECWatch.API/appsettings.json" ]; then
        envsubst < API/SECWatch.API/appsettings.json > deploy/appsettings.Production.json
        echo -e "${GREEN}✓ Created deploy/appsettings.Production.json from base appsettings.json${NC}"
    else
        echo -e "${RED}ERROR: API/SECWatch.API/appsettings.json not found${NC}"
        exit 1
    fi
    
    # Process Worker Service appsettings.json
    if [ -f "API/SECWatch.AlertWorkerService/appsettings.json" ]; then
        envsubst < API/SECWatch.AlertWorkerService/appsettings.json > deploy/appsettings.AlertWorkerService.Production.json
        echo -e "${GREEN}✓ Created deploy/appsettings.AlertWorkerService.Production.json from base appsettings.json${NC}"
    else
        echo -e "${RED}ERROR: API/SECWatch.AlertWorkerService/appsettings.json not found${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Production configs created with environment variable substitution${NC}"
}

# Function to deploy to server
deploy_to_server() {
    if [ "$LOCAL_DEPLOY" = true ]; then
        echo -e "${YELLOW}Skipping remote deployment (local mode)${NC}"
        return
    fi
    
    echo -e "${GREEN}Deploying to server...${NC}"
    
    # Create deployment archive
    echo -e "${YELLOW}Creating deployment archive...${NC}"
    tar -czf deploy.tar.gz \
        publish/ \
        deploy/ \
        docker-compose.prod.yml \
        deploy/nginx.conf \
        Microservices/SECMiner/ \
        --exclude='node_modules' \
        --exclude='__pycache__' \
        --exclude='*.pyc' \
        --exclude='.git' \
        --exclude='venv'
    
    # Copy to server
    echo -e "${YELLOW}Copying files to server...${NC}"
    scp -i "$SSH_KEY" deploy.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/
    
    # Execute deployment on server
    echo -e "${YELLOW}Executing deployment on server...${NC}"
    ssh -i "$SSH_KEY" ${SERVER_USER}@${SERVER_HOST} << EOF
        set -e
        sudo mkdir -p ${DEPLOY_PATH}
        cd /tmp
        sudo tar -xzf deploy.tar.gz -C ${DEPLOY_PATH}
        sudo chown -R \$(whoami):\$(whoami) ${DEPLOY_PATH}
        
        # Start Docker services (includes all apps: API, Worker, Miner, and infrastructure)
        cd ${DEPLOY_PATH}
        docker compose -f docker-compose.prod.yml up -d --build
        
        echo "Deployment completed successfully!"
EOF
    
    # Cleanup
    rm -f deploy.tar.gz
    
    echo -e "${GREEN}✓ Deployment completed${NC}"
}

# Function to setup systemd services (no longer needed - everything runs in Docker)
# Keeping this as a no-op for backwards compatibility, but services are now in docker-compose
setup_systemd() {
    echo -e "${YELLOW}Note: All services now run in Docker containers via docker-compose.prod.yml${NC}"
    echo -e "${YELLOW}No systemd service files needed.${NC}"
}

# Function to create nginx config
create_nginx_config() {
    echo -e "${GREEN}Creating nginx configuration...${NC}"
    
    mkdir -p deploy
    
    if [ -f "deploy/templates/nginx.conf.template" ]; then
        envsubst < deploy/templates/nginx.conf.template > deploy/nginx.conf
        echo -e "${GREEN}✓ Created deploy/nginx.conf from template${NC}"
    else
        echo -e "${RED}ERROR: Template file deploy/templates/nginx.conf.template not found${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}Nginx config created with environment variable substitution${NC}"
}

# Main execution
main() {
    check_prerequisites
    
    # Load environment variables from .env file
    load_env
    
    # Build projects
    build_dotnet
    build_client
    
    # Create deployment files (uses env vars loaded above)
    create_production_configs
    create_nginx_config
    # Note: setup_systemd is no longer needed - everything runs in Docker
    
    # Copy client build and configs to publish directory
    echo -e "${GREEN}Preparing deployment package...${NC}"
    mkdir -p publish/client
    cp -r Client/dist/* publish/client/
    
    # Copy processed appsettings to publish directories
    if [ -f "deploy/appsettings.Production.json" ]; then
        cp deploy/appsettings.Production.json publish/api/appsettings.Production.json
        echo -e "${GREEN}✓ Copied appsettings.Production.json to publish/api${NC}"
    fi
    
    if [ -f "deploy/appsettings.AlertWorkerService.Production.json" ]; then
        cp deploy/appsettings.AlertWorkerService.Production.json publish/worker/appsettings.Production.json
        echo -e "${GREEN}✓ Copied appsettings.Production.json to publish/worker${NC}"
    fi
    
    if [ "$LOCAL_DEPLOY" = false ]; then
        deploy_to_server
    else
        echo -e "${GREEN}Local build completed. Files are in the publish/ directory.${NC}"
        echo -e "${YELLOW}Next steps:${NC}"
        echo "1. Update configuration files in deploy/ directory"
        echo "2. Copy files to your server"
        echo "3. Run docker-compose.prod.yml on the server"
        echo "4. Setup systemd services"
        echo "5. Configure nginx"
    fi
}

# Run main function
main

