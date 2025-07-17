#!/bin/bash

echo "🚀 Starting ElectraStore..."
echo "================================"

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

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Initialize database if it doesn't exist
if [ ! -f "database/electrastore.db" ]; then
    echo "🗄️ Initializing database..."
    npm run init-db
fi

# Start the server
echo "🌟 Starting ElectraStore server..."
echo "📍 Access the application at: http://localhost:3000"
echo "🔑 Demo credentials:"
echo "   Admin: admin / admin123"
echo "   Staff: staff / staff123"
echo "   Cashier: cashier / cashier123"
echo "================================"
echo "Press Ctrl+C to stop the server"
echo ""

npm start