# Backend Configuration

Copy `.env.example` to `.env` and fill in your NVIDIA API key:

```bash
cp .env.example .env
```

Then edit `.env` and add your API credentials:

```
OPENAI_API_KEY=your_nvidia_api_key_here
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
OPENAI_MODEL=openai/gpt-oss-120b
```

## Installation

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running

```bash
# Development server with auto-reload
python main.py

# Or use Uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The server will be available at `http://localhost:8000`

### Health Check

```bash
curl http://localhost:8000/health
```

### Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "history": [],
    "temperature": 0.7,
    "max_tokens": 1024
  }'
```
