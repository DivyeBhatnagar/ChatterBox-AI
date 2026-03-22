# AI Chatbot Application

A professional, production-grade AI chatbot built with React + TypeScript (frontend) and FastAPI + Python (backend), integrated with NVIDIA's OpenAI-compatible API for advanced language model capabilities.

## 🎯 Features

### Frontend
- **Modern React + TypeScript** - Type-safe, maintainable code
- **Dark Theme UI** - Professional, minimalist design inspired by leading AI platforms
- **Chat Interface** - Clean message bubbles with distinction between user and AI responses
- **Real-time Feedback** - Typing indicators, loading states, and smooth animations
- **Markdown Support** - Formatted responses with syntax highlighting
- **Message Management** - Copy, search, regenerate, and clear conversation
- **Settings Panel** - Customize temperature, max tokens, and UI preferences
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Local Storage** - Persist conversation history and settings
- **Error Handling** - User-friendly error messages and recovery UI
- **Accessibility** - WCAG compliance with proper ARIA labels

### Backend
- **FastAPI Framework** - Modern, fast Python web framework
- **OpenAI Integration** - Compatible with NVIDIA's endpoint and other OpenAI-compatible APIs
- **Rate Limiting** - Built-in request throttling per IP address
- **Conversation Context** - Maintains message history for coherent multi-turn conversations
- **Request Validation** - Input sanitization and validation
- **Error Handling** - Graceful handling of API failures and rate limits
- **Structured Logging** - Debug and monitor API calls
- **CORS Support** - Seamless frontend-backend communication
- **Health Check** - Endpoint for server status monitoring
- **Retry Logic** - Automatic retries with exponential backoff

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.9+ (backend)
- NVIDIA API Key (get one at https://build.nvidia.com/)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your NVIDIA API key
   ```

5. **Start the server**
   ```bash
   python main.py
   ```
   Server runs on http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # Adjust VITE_API_BASE_URL if backend is on different port
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   App runs on http://localhost:5173

## 📁 Project Structure

```
Chatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application and routes
│   │   ├── config.py        # Settings and configuration
│   │   ├── models.py        # Pydantic models
│   │   ├── rate_limit.py    # Rate limiting logic
│   │   └── services/
│   │       ├── __init__.py
│   │       └── openai_client.py  # OpenAI API integration
│   ├── main.py              # Server entry point
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example         # Environment template
│   └── README.md            # Backend documentation
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ChatHeader.tsx         # Header with status
    │   │   ├── ChatInput.tsx          # Message input area
    │   │   ├── ChatMessageBubble.tsx  # Message display
    │   │   ├── ErrorBoundary.tsx      # Error handling
    │   │   ├── MessageSkeleton.tsx    # Loading state
    │   │   ├── SettingsPanel.tsx      # Settings UI
    │   │   └── TypingIndicator.tsx    # Typing animation
    │   ├── lib/
    │   │   └── api.ts                 # API client
    │   ├── types/
    │   │   └── chat.ts                # TypeScript definitions
    │   ├── App.tsx                    # Main app component
    │   ├── index.css                  # Tailwind & custom styles
    │   └── main.tsx                   # React entry point
    ├── index.html
    ├── package.json
    ├── vite.config.ts                 # Vite configuration
    ├── tailwind.config.js             # Tailwind CSS config
    ├── postcss.config.js              # PostCSS config
    ├── .env.example                   # Environment template
    └── tsconfig.json                  # TypeScript config
```

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Required
OPENAI_API_KEY=your_nvidia_api_key_here
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
OPENAI_MODEL=openai/gpt-oss-120b

# Optional (with defaults)
APP_ENV=development
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173
REQUEST_TIMEOUT_SECONDS=45
MAX_INPUT_CHARS=4000
RATE_LIMIT_REQUESTS=30
RATE_LIMIT_WINDOW_SECONDS=60
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=1024
```

### Frontend Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

Returns server status and configuration info.

### Chat
```bash
POST /chat
Content-Type: application/json

{
  "message": "What is the capital of France?",
  "history": [
    {"role": "user", "content": "Hello", "timestamp": "2026-03-22T..."},
    {"role": "assistant", "content": "Hi! How can I help?", "timestamp": "2026-03-22T..."}
  ],
  "conversation_id": "uuid-string-optional",
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1024
}
```

Response (200 OK):
```json
{
  "conversation_id": "uuid-string",
  "response": "The capital of France is Paris.",
  "model": "openai/gpt-oss-120b",
  "timestamp": "2026-03-22T...",
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 10,
    "total_tokens": 25
  },
  "status": "success"
}
```

## 🎨 Design System

### Colors (Dark Theme)
- **Background**: `#0a0a0a` (deep charcoal)
- **Surface**: `#11131f` (darker cards)
- **Text**: `#f4f4f5` (light gray)
- **Accent**: Indigo/Purple gradient (`#6366f1` to `#a855f7`)
- **Borders**: White/10 opacity subtle dividers

### Components
- **Message Bubbles**: Gradient backgrounds for user, subtle for AI
- **Input Area**: Auto-expanding textarea with character counter
- **Loading States**: Skeleton loaders and typing indicators
- **Animations**: Smooth fade-ins, slide-ups with Framer Motion

## 🧪 Testing

### Backend Test Request
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "history": [],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

### Frontend Development
```bash
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Run ESLint
```

## 🔒 Security Considerations

- API keys are never exposed in frontend responses
- CORS is configured to only allow specified origins
- Input is sanitized to remove control characters
- Request validation prevents malformed data
- Rate limiting prevents abuse
- HTTPS recommended for production
- Session/conversation data stored locally on client

## 📦 Dependencies

### Frontend
- **react** 19.2+ - UI library
- **axios** - HTTP client
- **tailwindcss** - CSS utility framework
- **framer-motion** - Animation library
- **react-markdown** - Markdown rendering
- **lucide-react** - Icon library
- **typescript** - Type safety
- **vite** - Build tool

### Backend
- **fastapi** 0.116+ - Web framework
- **uvicorn** - ASGI server
- **openai** 1.109+ - OpenAI client
- **pydantic** & **pydantic-settings** - Validation
- **tenacity** - Retry logic
- **python-dotenv** - Environment variables

## 🚀 Deployment

### Backend (Production)
```bash
# Build and run with Gunicorn + Uvicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

# Or Docker
docker build -t chatbot-backend .
docker run -p 8000:8000 --env-file .env chatbot-backend
```

### Frontend (Production)
```bash
# Build static assets
npm run build

# Serve with any static host (Vercel, Netlify, S3, etc.)
npm run preview
```

## 🛠️ Troubleshooting

### Backend Issues
- **ModuleNotFoundError**: Ensure virtual environment is activated
- **API Key Error**: Check `.env` file has correct NVIDIA API key
- **CORS Error**: Verify `ALLOWED_ORIGINS` includes frontend URL
- **Rate Limit**: Adjust `RATE_LIMIT_REQUESTS` in `.env`

### Frontend Issues
- **API Connection**: Check backend is running on correct port
- **Blank Page**: Open browser console for error details
- **Styling Issues**: Run `npm run build` to verify Tailwind compilation

## 📝 License

This is a demonstration project for educational purposes.

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review API response error codes
3. Check browser/server console for detailed logs
4. Verify environment configuration

---

**Built with ❤️ using React, FastAPI, and NVIDIA's OpenAI-compatible API**
