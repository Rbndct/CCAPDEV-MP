# Court Reservation System - Docker Development Guide

## Quick Start

### First Time Setup
```bash
# Build the Docker image
docker-compose build

# Start the development server
docker-compose up
```

### Daily Development
```bash
# Start containers (in foreground)
docker-compose up

# OR start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Access the Application
- **URL:** http://localhost:5173
- **Hot Reload:** Enabled - changes to code will automatically refresh

## Common Commands

### Container Management
```bash
# Rebuild after package.json changes
docker-compose build

# Restart containers
docker-compose restart

# Stop and remove containers
docker-compose down

# View running containers
docker ps
```

### Installing New Packages
```bash
# Option 1: Rebuild container
docker-compose down
docker-compose build
docker-compose up

# Option 2: Install in running container
docker-compose exec frontend npm install <package-name>
```

### Troubleshooting
```bash
# View container logs
docker-compose logs frontend

# Access container shell
docker-compose exec frontend sh

# Remove all containers and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Team Workflow

### For New Team Members
1. Install Docker Desktop
2. Clone the repository
3. Run `docker-compose up`
4. Open http://localhost:5173

### Sharing Changes
- Code changes are automatically synced via volumes
- After pulling new code, just refresh browser
- If `package.json` changed, run `docker-compose build`

## Benefits
✅ Same Node version for everyone (18-alpine)
✅ No "works on my machine" issues
✅ Isolated environment
✅ Easy onboarding
✅ Hot reload works perfectly

## Notes
- Node modules are stored in the container (faster performance)
- Source code is mounted from your local machine
- Changes to code reflect immediately
- No need to install Node.js locally!
