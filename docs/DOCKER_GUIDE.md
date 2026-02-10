# Court Reservation System - Docker Setup Guide

---

## 📋 Prerequisites (Do This First!)

### 1. Install Docker Desktop

**Mac Users:**

1. Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download "Docker Desktop for Mac"
3. Open the downloaded file and drag Docker to Applications
4. Launch Docker Desktop from Applications
5. Wait for Docker to start (you'll see a whale icon in your menu bar at the top)

**Windows Users:**

1. Go to [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Download "Docker Desktop for Windows"
3. Run the installer and follow the prompts
4. Restart your computer if prompted
5. Launch Docker Desktop and wait for it to start

**How to know it's working:** You should see the Docker whale icon in your system tray/menu bar.

### 2. Get the Project Code

If you haven't already cloned the repository:

```bash
git clone <your-repository-url>
cd CCAPDEV-MP
```

---

## 🚀 First Time Setup (Only Do This Once!)

Open your terminal in the project folder and run:

```bash
cd docker
docker-compose build
```

**What's happening?** Docker is downloading Node.js and installing all project dependencies. This will take 2-5 minutes the first time.

---

## ▶️ Starting the Development Server

Every time you want to work on the project, run:

```bash
cd docker
docker-compose up
```

**What you'll see:**

- Lots of text scrolling (that's normal!)
- Eventually you'll see: `Local: http://localhost:5173/`
- The server is now running!

**Open your browser** and go to: **http://localhost:5173**

You should see the Court Reservation System! 🎉

---

## 🛑 Stopping the Server

When you're done working:

1. Go to the terminal where `docker-compose up` is running
2. Press **Ctrl + C** (Windows/Mac/Linux)
3. Wait for it to shut down gracefully

**Alternative:** If you want to force stop everything:

```bash
docker-compose down
```

---

## 💻 Daily Workflow

### Starting Your Day

```bash
# Navigate to project folder
cd CCAPDEV-MP/docker

# Start the server
docker-compose up
```

### While Coding

- **Make changes to your code** - they'll appear automatically in the browser!
- **No need to restart** - hot reload is enabled
- **Just save and refresh** your browser

### After Pulling New Code from Git

```bash
# Pull the latest changes
git pull

# If only code changed: just refresh your browser
# If package.json changed: rebuild and restart
docker-compose down
docker-compose build
docker-compose up
```

### Ending Your Day

- Press **Ctrl + C** in the terminal
- Or run `docker-compose down`

---

## 🔧 Common Tasks

### Installing a New NPM Package

**Option 1: Rebuild (Recommended for beginners)**

```bash
# Stop the server
docker-compose down

# Rebuild with new packages
docker-compose build

# Start again
docker-compose up
```

**Option 2: Install while running**

```bash
# In a new terminal window
docker-compose exec frontend npm install <package-name>
```

### Viewing Logs

If you started with `docker-compose up -d` (background mode):

```bash
docker-compose logs -f
```

### Something Not Working?

**Try the "turn it off and on again" approach:**

```bash
# Stop everything
docker-compose down

# Rebuild from scratch (no cache)
docker-compose build --no-cache

# Start again
docker-compose up
```

**Still stuck?** Check if Docker Desktop is running (look for the whale icon).

---

## ❓ FAQ

### "What port does it run on?"

**Port 5173** - same as regular Vite. Access at http://localhost:5173

### "My changes aren't showing up!"

1. Make sure you saved the file
2. Refresh your browser (Ctrl/Cmd + R)
3. Check the terminal for errors

### "I see 'port already in use' error"

Something else is using port 5173. Either:

- Stop the other application
- Or run `docker-compose down` if you have another instance running

## 📝 Quick Reference Card

```
NAVIGATE:  cd docker
START:     docker-compose up
STOP:      Ctrl + C  or  docker-compose down
REBUILD:   docker-compose build
LOGS:      docker-compose logs -f
URL:       http://localhost:5173
```
