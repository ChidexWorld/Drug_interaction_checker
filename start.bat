@echo off
echo 🚀 Starting Precious Drug Interaction Checker...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
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

echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing root dependencies...
call npm install

REM Install server dependencies
echo Installing server dependencies...
cd server
call npm install
cd ..

REM Install client dependencies
echo Installing client dependencies...
cd client
call npm install
cd ..

echo 🗄️ Setting up database...

REM Initialize database
cd server
call node scripts/initDatabase.js

REM Seed basic data
call node scripts/seedDatabase.js

REM Seed interaction data
call node scripts/seedInteractions.js

cd ..

echo ✅ Setup complete!
echo.
echo To start the application:
echo 1. Start the backend: cd server ^&^& npm run dev
echo 2. Start the frontend: cd client ^&^& npm run dev
echo 3. Open http://localhost:3000 in your browser
echo.
echo Or run both with: npm run dev

pause
