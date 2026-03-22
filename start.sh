#!/bin/bash

# AI Chatbot - Startup Script
# This script starts both the backend and frontend servers in separate terminals

echo "🤖 AI Chatbot Application - Startup Script"
echo "==========================================="

# Check if required commands exist
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 not found. Please install Python 3.9 or higher."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

# Start Backend
echo -e "${YELLOW}Starting Backend Server...${NC}"
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f ".env" ]; then
    echo "❌ Backend .env file not found. Please create one with your API key."
    echo "   Run: cp .env.example .env"
    exit 1
fi

echo -e "${GREEN}✓ Backend environment ready${NC}"
echo "Starting FastAPI server on http://localhost:8000"
python3 main.py &
BACKEND_PID=$!

# Give backend time to start
sleep 2

# Start Frontend
echo ""
echo -e "${YELLOW}Starting Frontend Development Server...${NC}"
cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend dependencies ready${NC}"
echo "Starting Vite dev server on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${GREEN}==========================================="
echo "✓ Both servers are starting!"
echo "==========================================="
echo ""
echo -e "${YELLOW}Accessing the application:${NC}"
echo "  Frontend: http://localhost:5173"
echo "  Backend API: http://localhost:8000"
echo "  API Health: http://localhost:8000/health"
echo ""
echo -e "${YELLOW}To stop servers:${NC}"
echo "  Press Ctrl+C or run: kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for both processes
wait
