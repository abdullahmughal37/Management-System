@echo off
echo ================================================
echo           ElectraStore Startup Script
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies if needed
if not exist "node_modules" (
    echo.
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Initialize database if needed
if not exist "database\electrastore.db" (
    echo.
    echo 🗄️ Initializing database...
    npm run init-db
    if %errorlevel% neq 0 (
        echo ❌ Failed to initialize database
        pause
        exit /b 1
    )
)

REM Start the server
echo.
echo 🌟 Starting ElectraStore server...
echo 📍 Access the application at: http://localhost:3000
echo.
echo 🔑 Demo credentials:
echo    Admin: admin / admin123
echo    Staff: staff / staff123
echo    Cashier: cashier / cashier123
echo.
echo ================================================
echo Press Ctrl+C to stop the server
echo ================================================
echo.

npm start