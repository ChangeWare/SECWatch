# Deployment Configuration

This directory contains deployment configuration templates and files.

## What Gets Committed to Git

✅ **Committed:**
- `deploy.sh` - The main deployment script (works on Mac, Linux, WSL)
- `docker-compose.prod.yml` - Docker Compose configuration
- `DEPLOYMENT.md` - This deployment guide
- Template files (without real credentials)

❌ **NOT Committed (gitignored):**
- `appsettings.Production.json` - Production config with real credentials
- `appsettings.AlertWorkerService.Production.json` - Worker config with real credentials
- `nginx.conf` - Nginx config with your domain/IP
- `systemd/*.service` - Systemd files with your user/paths
- `.env` files - Environment variables with secrets

## Syncing Between Mac and Windows

### The Script Syncs Automatically

Since `deploy.sh` is in Git, it automatically syncs between your machines:

```bash
# On Mac
git pull
./deploy.sh local

# On Windows (WSL)
git pull
./deploy.sh local
```

### Handling Production Configs

Production configs are gitignored for security. You have a few options:

#### Option 1: .env File (Recommended)

The script automatically loads `deploy/.env` if it exists:

```bash
# On each machine
cp deploy/env.example deploy/.env
# Edit deploy/.env with your values
./deploy.sh  # Automatically loads .env
```

The `.env` file is gitignored, so you'll need to create it on each machine or sync it securely.

#### Option 2: Private Config Repository

Create a separate private Git repo for deployment configs:

```bash
# Clone your private configs repo
git clone <private-repo> deploy-configs
cp deploy-configs/* deploy/
```

#### Option 3: Manual Sync

Manually copy config files between machines using:
- `scp` / `rsync`
- Cloud storage (Dropbox, iCloud, etc.)
- USB drive

#### Option 4: Secret Manager

Use a service like:
- AWS Secrets Manager
- HashiCorp Vault
- 1Password CLI
- Bitwarden CLI

## First-Time Setup on Each Machine

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd SECWatch
   ```

2. **Make script executable** (Mac/Linux):
   ```bash
   chmod +x deploy.sh
   ```
   (On Windows/WSL, this happens automatically)

3. **Run local build to generate templates:**
   ```bash
   ./deploy.sh local
   ```

4. **Configure production settings:**
   - Edit `deploy/appsettings.Production.json`
   - Edit `deploy/appsettings.AlertWorkerService.Production.json`
   - Edit `deploy/nginx.conf`
   - Edit `deploy/systemd/*.service` files

5. **Set deployment variables** (or edit script):
   ```bash
   export DEPLOY_USER="your-username"
   export DEPLOY_HOST="your-server-ip"
   ```

6. **Deploy:**
   ```bash
   ./deploy.sh
   ```

## Workflow Example

### Day 1: Setup on Mac
```bash
git clone <repo>
cd SECWatch
chmod +x deploy.sh
./deploy.sh local
# Configure deploy/ files with real values
./deploy.sh
```

### Day 2: Work on Windows
```bash
git pull  # Gets latest code changes
# Edit code...
git add .
git commit -m "My changes"
git push
./deploy.sh local  # Test build
./deploy.sh        # Deploy to server
```

### Day 3: Back on Mac
```bash
git pull  # Gets your Windows changes
# Continue development...
```

The deployment script itself is always in sync via Git!
