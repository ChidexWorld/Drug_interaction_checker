#!/bin/bash

# Precious Drug Interaction Checker - Startup Script

echo "🚀 Starting Precious Drug Interaction Checker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm install
cd ..

echo "🗄️ Setting up database..."

# Initialize database
cd server
node scripts/initDatabase.js

# Seed basic data
node scripts/seedDatabase.js

# Seed interaction data
node scripts/seedInteractions.js

cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend: cd server && npm run dev"
echo "2. Start the frontend: cd client && npm run dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Or run both with: npm run dev"
