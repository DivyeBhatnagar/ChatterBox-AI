#!/usr/bin/env python3
"""
AI Chatbot Backend Server

Run with: python main.py
or: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"""

import logging
import sys
from pathlib import Path

import uvicorn

# Add project to path
PROJECT_ROOT = Path(__file__).parent.absolute()
sys.path.insert(0, str(PROJECT_ROOT))

if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
