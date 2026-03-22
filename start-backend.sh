#!/bin/bash

# Backend-only startup script

PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$PROJECT_ROOT/backend"

cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f ".env" ]; then
    echo "Error: .env file not found in backend directory"
    echo "Please create one: cp .env.example .env"
    exit 1
fi

echo "Starting FastAPI server on http://localhost:8000"
python3 main.py
