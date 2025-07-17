# How to Run ElectraStore in Windows Command Prompt (CMD)

## Step-by-Step Guide for Windows CMD

### 1. Extract the ZIP File
- Right-click the downloaded zip file
- Select "Extract All..."
- Choose a destination folder (e.g., `C:\ElectraStore`)
- Click "Extract"

### 2. Install Node.js (if not installed)
- Go to [nodejs.org](https://nodejs.org/)
- Download the Windows installer (LTS version recommended)
- Run the installer and follow the setup wizard
- **Important**: Make sure to check "Add to PATH" during installation

### 3. Open Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter
- Or search "Command Prompt" in Start menu

### 4. Navigate to Project Directory
```cmd
cd C:\path\to\extracted\electrastore
```
Example:
```cmd
cd C:\Users\YourName\Downloads\electrastore
```

### 5. Check Node.js Installation
```cmd
node --version
npm --version
```
You should see version numbers if installed correctly.

### 6. Run the Application

#### Method 1: Manual Steps (Recommended for Windows)
```cmd
REM Install dependencies
npm install

REM Initialize database
npm run init-db

REM Start the server
npm start
```

#### Method 2: Using start.sh (if you have Git Bash)
```cmd
REM Make sure you're in the project directory first
start.sh
```

### 7. Access the Application
- Open your web browser
- Go to: `http://localhost:3000`
- Login with demo credentials:
  - **Admin**: `admin` / `admin123`
  - **Staff**: `staff` / `staff123`
  - **Cashier**: `cashier` / `cashier123`

## Windows CMD Commands Summary

### Complete Setup in One Go:
```cmd
REM Navigate to project folder
cd C:\path\to\your\electrastore

REM Install, initialize, and start
npm install && npm run init-db && npm start
```

### If You Get Errors:

**"node is not recognized as internal or external command"**
- Node.js is not installed or not in PATH
- Reinstall Node.js and make sure "Add to PATH" is checked

**"Port 3000 already in use"**
```cmd
REM Find what's using port 3000
netstat -ano | findstr :3000

REM Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Permission errors**
- Run Command Prompt as Administrator
- Right-click "Command Prompt" → "Run as administrator"

**Module not found errors**
```cmd
REM Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

**Database errors**
```cmd
REM Delete database and recreate
del database\electrastore.db
npm run init-db
```

## Stopping the Application
- In the CMD window where the server is running
- Press `Ctrl + C`
- Type `Y` when prompted to terminate

## Alternative: Using PowerShell
If you prefer PowerShell over CMD:
```powershell
# Navigate to project
cd C:\path\to\electrastore

# Run commands
npm install
npm run init-db
npm start
```

## Creating a Batch File (Optional)
Create a `run.bat` file in the project directory:
```batch
@echo off
echo Starting ElectraStore...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Initialize database if needed
if not exist "database\electrastore.db" (
    echo Initializing database...
    npm run init-db
)

REM Start the server
echo Starting server...
echo Access the application at: http://localhost:3000
echo.
echo Demo credentials:
echo Admin: admin / admin123
echo Staff: staff / staff123
echo Cashier: cashier / cashier123
echo.
echo Press Ctrl+C to stop the server
echo.

npm start
```

Then simply double-click `run.bat` to start the application!

## Troubleshooting Windows-Specific Issues

### Windows Defender/Antivirus
- Windows Defender might block the application
- Add the project folder to exclusions if needed

### Firewall
- Windows Firewall might prompt for network access
- Allow Node.js through the firewall

### Path Issues
- Use full paths if relative paths don't work
- Use forward slashes `/` or double backslashes `\\` in paths

---
**Success!** Your ElectraStore should now be running at `http://localhost:3000`