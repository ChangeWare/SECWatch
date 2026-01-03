# SECWatch Deployment Guide

This guide covers deploying SECWatch to your Ubuntu home server from both Mac and Windows (WSL).

## Prerequisites

### On Both Mac and Windows (WSL)

1. **Git** - Clone the repository on both machines
2. **.NET 9.0 SDK** - Install from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
3. **Node.js** - Install from [nodejs.org](https://nodejs.org/)
4. **Docker** - Install Docker Desktop (Mac) or Docker Desktop for Windows
5. **SSH Access** - Configure SSH keys for your Ubuntu server

### On Ubuntu Server

- Docker and Docker Compose
- Nginx (for reverse proxy)
- .NET 9.0 Runtime (only needed if running migrations manually)

## Quick Start

### 1. Clone and Setup (Both Machines)

```bash
git clone <your-repo-url>
cd SECWatch
chmod +x deploy.sh
```

### 2. Configure Deployment Settings

Set environment variables or edit the script directly:

```bash
# Option 1: Environment variables (recommended)
export DEPLOY_USER="your-username"
export DEPLOY_HOST="your-server-ip-or-hostname"
export DEPLOY_PATH="/opt/secwatch"
export SSH_KEY="~/.ssh/id_rsa"
export API_PORT="5181"

# Option 2: Edit deploy.sh directly (lines 14-22)
```

### 3. Build Locally (Test First)

```bash
./deploy.sh local
```

This will:
- Build .NET projects
- Build React client
- Create deployment configuration templates
- Prepare files in `publish/` directory

### 4. Configure Production Settings

Create a `.env` file from the example:

```bash
cp deploy/env.example deploy/.env
```

Edit `deploy/.env` with your actual values. The script will:
- Load environment variables from `deploy/.env`
- Use `envsubst` to replace placeholders in the base `appsettings.json` files
- Generate production configs with your actual values

**Important:** The `.env` file is gitignored - it won't be committed to Git. You'll need to create it on each machine or use a secure secret management solution.

### 5. Deploy to Server

```bash
./deploy.sh
```

This will:
- Build all projects
- Create deployment package
- Copy to server via SSH
- Setup services on the server

## Syncing Between Mac and Windows

### Option 1: Git (Recommended for Scripts)

The deployment scripts and templates are in Git, so they sync automatically:

```bash
# On Mac
git pull
./deploy.sh local

# On Windows (WSL)
git pull
./deploy.sh local
```

### Option 2: Syncing .env File

The `.env` file is gitignored for security. To sync between machines:

1. **Use a secure secret manager** (recommended):
   - AWS Secrets Manager
   - HashiCorp Vault
   - Azure Key Vault
   - 1Password CLI
   - Bitwarden CLI

2. **Use a private Git repository** for the .env file:
   ```bash
   # Create a separate private repo for .env
   git clone <private-env-repo> env-repo
   cp env-repo/.env deploy/.env
   ```

3. **Manual sync** via secure file transfer:
   ```bash
   # Using scp
   scp deploy/.env user@other-machine:/path/to/SECWatch/deploy/.env
   
   # Using rsync
   rsync -avz deploy/.env user@other-machine:/path/to/SECWatch/deploy/
   ```

4. **Cloud storage** (Dropbox, iCloud, etc.) - sync the deploy/ directory

## Platform-Specific Notes

### Mac

- Works natively with bash
- Docker Desktop provides Docker and Docker Compose
- SSH keys typically in `~/.ssh/id_rsa`

### Windows (WSL)

- Run from WSL terminal (bash)
- Docker Desktop for Windows integrates with WSL
- SSH keys in `~/.ssh/id_rsa` (WSL home directory)
- Paths are Linux-style even though Windows is the host

### Both Platforms

The script automatically detects and works with:
- `docker compose` (newer) or `docker-compose` (older)
- Different path separators
- Platform-specific tool locations

## Server Setup

### Initial Server Configuration

1. **Install Docker**:
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

2. **Install Docker Compose**:
   ```bash
   sudo apt-get update
   sudo apt-get install docker-compose-plugin
   ```

3. **Install Nginx**:
   ```bash
   sudo apt-get install nginx
   ```

4. **Create deployment directory**:
   ```bash
   sudo mkdir -p /opt/secwatch
   sudo chown $USER:$USER /opt/secwatch
   ```

### First Deployment

1. Run `./deploy.sh local` on your dev machine
2. Copy `deploy/` directory to server and update with real values
3. Copy `publish/` directory to server
4. Copy `docker-compose.prod.yml` to server
5. On server:
   ```bash
   # Start all Docker services (API, Worker, Miner, and infrastructure)
   cd /opt/secwatch
   docker compose -f docker-compose.prod.yml up -d --build
   
   # Setup Nginx
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/secwatch
   sudo ln -s /etc/nginx/sites-available/secwatch /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Database Migrations

On the server, run migrations:

```bash
cd /opt/secwatch/publish/api
dotnet ef database update --project ../../API/SECWatch.Infrastructure
```

## Updating Deployment

### After Code Changes

1. **Pull latest code** (on Mac or Windows):
   ```bash
   git pull
   ```

2. **Rebuild and deploy**:
   ```bash
   ./deploy.sh
   ```

The script will:
- Rebuild all projects
- Create new deployment package
- Deploy to server
- Restart services (if configured)

### Manual Service Restart

On the server:
```bash
# Restart all services
docker compose -f docker-compose.prod.yml restart

# Or restart individual services
docker compose -f docker-compose.prod.yml restart api
docker compose -f docker-compose.prod.yml restart worker
docker compose -f docker-compose.prod.yml restart miner
```

## Troubleshooting

### Script Issues

- **Permission denied**: `chmod +x deploy.sh`
- **Command not found**: Ensure tools are in PATH
- **SSH connection failed**: Check SSH keys and server access

### Server Issues

- **Services not starting**: Check logs with `journalctl -u secwatch-api -f`
- **Docker issues**: Check with `docker compose -f docker-compose.prod.yml ps`
- **Port conflicts**: Update ports in config files

### Cross-Platform Issues

- **Line endings**: Git should handle this automatically with `.gitattributes`
- **Path issues**: Script uses Linux-style paths (works in WSL)
- **Docker access**: Ensure Docker Desktop is running

## Security Best Practices

1. **Never commit** production configs with real credentials
2. **Use strong passwords** for all services
3. **Restrict SSH access** to your server
4. **Use firewall rules** to limit exposed ports
5. **Enable SSL/TLS** for production (Let's Encrypt recommended)
6. **Rotate secrets** regularly
7. **Use environment variables** or secret managers for sensitive data

## Environment Variables Reference

```bash
DEPLOY_USER          # SSH username for server
DEPLOY_HOST          # Server IP or hostname
DEPLOY_PATH          # Deployment path on server (default: /opt/secwatch)
SSH_KEY              # Path to SSH private key (default: ~/.ssh/id_rsa)
API_PORT             # API port (default: 5181)
CLIENT_PORT          # Client port (default: 80)
```

## Next Steps

- Set up SSL certificates (Let's Encrypt)
- Configure monitoring and logging
- Set up automated backups
- Configure CI/CD pipeline (optional)

