# Getting Started Guide

## 📋 Prerequisites

Before starting, make sure you have:

- **Python 3.9+** - Download from [python.org](https://www.python.org/downloads/)
- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
- **NVIDIA API Key** - Get one at [https://build.nvidia.com/](https://build.nvidia.com/)

Verify installations:
```bash
python3 --version
node --version
npm --version
```

## 🚀 Quick Start (5 Minutes)

### Option 1: Automated Startup (Recommended)

```bash
cd /path/to/Chatbot
./start.sh
```

This will:
1. Set up the Python virtual environment
2. Start the FastAPI backend on http://localhost:8000
3. Install frontend dependencies
4. Start the React dev server on http://localhost:5173

Open your browser to **http://localhost:5173** and start chatting!

### Option 2: Manual Startup (Two Terminals)

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuration

### 1. Backend Configuration (`.env`)

The backend needs your NVIDIA API key. Edit `backend/.env`:

```env
OPENAI_API_KEY=your_nvidia_api_key_here
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
OPENAI_MODEL=openai/gpt-oss-120b
```

Or copy from the provided template:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your API key
```

### 2. Frontend Configuration (`.env`)

The frontend can optionally customize the API URL. Edit `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Or use the default:
```bash
cp frontend/.env.example frontend/.env
```

## ✅ Verification

### Check Backend
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-03-22T...",
  "environment": "development",
  "model": "openai/gpt-oss-120b"
}
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "history": [],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

### Check Frontend
Open http://localhost:5173 in your browser. You should see the AI Assistant chat interface.

## 🔧 Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'fastapi'"**
- Ensure virtual environment is activated: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`

**"OPENAI_API_KEY not set"**
- Check `backend/.env` exists and has your API key
- Format: `OPENAI_API_KEY=nvapi-...`

**"Connection refused" on port 8000**
- Backend may not be running
- Check backend terminal for errors
- Try a different port by editing `.env` and changing `PORT`

**Rate limit or quota errors**
- Check your NVIDIA API account has credits
- Try reducing `RATE_LIMIT_REQUESTS` in `.env`

### Frontend Issues

**"Failed to fetch" errors**
- Ensure backend is running on correct port
- Check `VITE_API_BASE_URL` in `.env` matches backend location
- Verify CORS is not blocking requests (check browser console)

**Blank page or styling issues**
- Clear browser cache: Ctrl+Shift+Delete
- Try: `npm run build && npm run preview`
- Check browser console for errors (F12)

**Module not found errors**
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf .vite`

## 📚 File Structure

```
Chatbot/
├── README.md                    # Main documentation
├── GETTING_STARTED.md          # This file
├── DOCKER.md                   # Docker setup guide
├── start.sh                    # Auto-start both servers
├── start-backend.sh            # Backend only
├── start-frontend.sh           # Frontend only
│
├── backend/
│   ├── .env                    # Configuration (create from .env.example)
│   ├── .env.example            # Configuration template
│   ├── requirements.txt        # Python dependencies
│   ├── main.py                 # Entry point
│   ├── app/
│   │   ├── main.py            # FastAPI application
│   │   ├── config.py          # Settings management
│   │   ├── models.py          # Data models
│   │   ├── rate_limit.py      # Rate limiting
│   │   └── services/
│   │       └── openai_client.py  # OpenAI integration
│   └── venv/                   # Virtual environment (created automatically)
│
└── frontend/
    ├── .env                    # Configuration (optional)
    ├── .env.example            # Configuration template
    ├── package.json            # Dependencies
    ├── src/
    │   ├── App.tsx             # Main component
    │   ├── main.tsx            # React entry point
    │   ├── index.css           # Tailwind styles
    │   ├── components/         # React components
    │   ├── lib/                # Utilities (API client)
    │   └── types/              # TypeScript definitions
    └── node_modules/           # Dependencies (created by npm install)
```

## 🎨 Customization

### Change Color Scheme
Edit `frontend/src/index.css` to modify the dark theme colors.

### Adjust Temperature/Tokens
Edit `frontend/src/App.tsx` line 24-27 for default settings, or use the Settings panel in the UI.

### Modify System Prompt
Edit `backend/app/services/openai_client.py` line 13-19 to change how the AI behaves.

### Adjust Rate Limiting
Edit `backend/.env`:
```env
RATE_LIMIT_REQUESTS=30          # Max requests per window
RATE_LIMIT_WINDOW_SECONDS=60    # Time window in seconds
```

## 🌐 Deploy to Production

### Backend Deployment

Option 1 - Railway/Render:
```bash
# Add Procfile to backend/
echo "web: uvicorn app.main:app --host 0.0.0.0 --port ${PORT}" > backend/Procfile
```

Option 2 - Docker:
```bash
cd backend
docker build -t chatbot-backend .
docker run -p 8000:8000 --env-file .env chatbot-backend
```

### Frontend Deployment

```bash
cd frontend
npm run build  # Creates dist/ folder
```

Deploy `dist/` to:
- **Vercel** (recommended): `vercel --prod`
- **Netlify**: Drag and drop `dist/` folder
- **GitHub Pages**: See Vite docs
- **Any static host**: Copy `dist/` contents

Update `VITE_API_BASE_URL` to your production backend URL.

## 🆘 Need Help?

1. **Check logs**: Look at terminal output for error messages
2. **Read error messages**: They usually explain what's wrong
3. **Try refresh**: Browser cache issues are common
4. **Clear everything**: `rm -rf node_modules venv && npm install && pip install -r requirements.txt`
5. **Check ports**: Ensure 8000 and 5173 are not in use: `lsof -i :8000`

## 📞 Support Resources

- Backend Framework: [FastAPI Docs](https://fastapi.tiangolo.com/)
- Frontend Framework: [React Docs](https://react.dev/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- API: [NVIDIA Endpoints](https://docs.nvidia.com/ai-enterprise/endpoints/)
- Errors: Check browser console (F12) and server logs

---

You're all set! Happy coding! 🚀
