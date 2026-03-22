# Architecture & Deployment Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser (User)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
        ┌────────────▼───────────────┐
        │   React Frontend (SPA)      │
        │  - TypeScript Components    │
        │  - Tailwind CSS Dark Theme  │
        │  - State Management         │
        │  - LocalStorage Persistence │
        └────────────────┬────────────┘
                         │
                    VITE Dev/Build
                         │
        ┌────────────────▼────────────────┐
        │   Axios HTTP Client             │
        │  - Request/Response Handling    │
        │  - Error Management            │
        │  - CORS Support                │
        └────────────────┬────────────────┘
                         │
            http://localhost:8000
                         │
        ┌────────────────▼────────────────────────┐
        │      FastAPI Backend (REST API)         │
        │   ┌──────────────────────────────────┐  │
        │   │  Routes                          │  │
        │   │  - POST /chat                    │  │
        │   │  - GET /health                   │  │
        │   └────────┬─────────────────────────┘  │
        │            │                            │
        │   ┌────────▼──────────────────────────┐ │
        │   │  Services & Logic                │ │
        │   │  - Request Validation            │ │
        │   │  - Rate Limiting                 │ │
        │   │  - Message Sanitization          │ │
        │   │  - Conversation Management       │ │
        │   │  - Error Handling & Logging      │ │
        │   └────────┬─────────────────────────┘ │
        │            │                            │
        │   ┌────────▼──────────────────────────┐ │
        │   │  OpenAI Client Service           │ │
        │   │  - Message Building              │ │
        │   │  - API Integration               │ │
        │   │  - Retry Logic (Tenacity)        │ │
        │   │  - Response Parsing              │ │
        │   └────────┬─────────────────────────┘ │
        └────────────┼─────────────────────────────┘
                     │
                     │ HTTPS
                     │
  ┌──────────────────▼──────────────────┐
  │   NVIDIA OpenAI-Compatible API      │
  │   https://integrate.api.nvidia.com  │
  │                                      │
  │   Model: openai/gpt-oss-120b        │
  └──────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Styling**: Tailwind CSS 3.4
- **HTTP Client**: Axios 1.13
- **Animations**: Framer Motion 12.38
- **Markdown**: React Markdown with syntax highlighting
- **Icons**: Lucide React
- **Build Tool**: Vite 8
- **Package Manager**: npm

### Backend
- **Framework**: FastAPI 0.116
- **Server**: Uvicorn 0.35 (ASGI)
- **Runtime**: Python 3.9+
- **Validation**: Pydantic 2.12
- **Configuration**: Python-dotenv 1.1
- **API Integration**: OpenAI 1.109
- **Retries**: Tenacity 9.1
- **HTTP**: HTTPX 0.28

### Infrastructure
- **Development**: Local development servers
- **Production**: Docker containers, cloud platforms
- **APIs**: NVIDIA OpenAI-compatible endpoints

## Data Flow

### 1. User Message Flow

```
User Input
    ↓
Frontend Validation
    ↓
Store in Component State
    ↓
Send via Axios POST /chat
    ↓
Backend Receives Request
    ↓
Validate & Sanitize Input
    ↓
Check Rate Limit
    ↓
Build Message History
    ↓
Add System Prompt
    ↓
Call OpenAI API
    ↓
Parse Response
    ↓
Store in Conversation Store
    ↓
Return to Frontend
    ↓
Update UI (Add Assistant Message)
    ↓
Save to LocalStorage
    ↓
Scroll to Bottom
```

### 2. State Management

**Frontend:**
- React `useState` for messages, input, UI state
- `useRef` for scroll and textarea height management
- `localStorage` for persistence
- `useCallback` for memoized event handlers

**Backend:**
- In-memory dictionary for conversation storage
- Rate limiter with time-windowed queue
- Environment variables for configuration

## Component Architecture

### Frontend Components

```
App.tsx (Main)
├── ChatHeader.tsx
│   ├── Status Indicator
│   ├── Online/Offline Badge
│   ├── Settings Button
│   └── Regenerate Button
├── ChatMessageBubble.tsx (Memo)
│   ├── User/Assistant Styling
│   ├── Markdown Renderer
│   ├── Copy to Clipboard
│   └── Timestamps
├── ChatInput.tsx
│   ├── Auto-expanding Textarea
│   ├── Character Counter
│   ├── Send Button
│   └── Clear Chat Button
├── TypingIndicator.tsx
│   └── Animated Dots
├── MessageSkeleton.tsx
│   └── Loading State
├── SettingsPanel.tsx
│   ├── Temperature Slider
│   ├── Token Input
│   └── Feature Toggles
└── ErrorBoundary.tsx
    └── Fallback UI

Supporting Files:
├── lib/api.ts (HTTP Client)
└── types/chat.ts (TypeScript Definitions)
```

### Backend Structure

```
app/
├── main.py (FastAPI Application)
│   ├── CORS Middleware
│   ├── Error Handlers
│   ├── Routes
│   │   ├── GET /health
│   │   └── POST /chat
│   ├── Rate Limiter
│   └── Conversation Store
├── config.py (Settings)
│   └── Pydantic Settings with .env support
├── models.py (Data Models)
│   ├── ChatMessage
│   ├── ChatRequest
│   ├── ChatResponse
│   └── ErrorResponse
├── rate_limit.py (Rate Limiting)
│   └── InMemoryRateLimiter
└── services/
    └── openai_client.py
        ├── Message Building
        ├── API Integration
        ├── Retry Logic
        └── Response Parsing
```

## Deployment Options

### Option 1: Local Development

```bash
# Backend
cd backend && source venv/bin/activate && python3 main.py

# Frontend
cd frontend && npm run dev
```

**Pros**: Full control, easy debugging
**Cons**: Manual management, not scalable

### Option 2: Docker Compose (Local/Staging)

```bash
docker-compose build
docker-compose up
```

**Pros**: Reproducible environment, easier multi-service setup
**Cons**: Requires Docker installation

### Option 3: Cloud Platforms

#### Backend Deployment (Heroku/Railway/Render)

```bash
# Push to platform
git push heroku main

# Or use containerized approach
docker push your-registry/chatbot-backend
```

**Environment Variables:**
```
OPENAI_API_KEY=your_key
OPENAI_BASE_URL=https://integrate.api.nvidia.com/v1
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### Frontend Deployment (Vercel/Netlify)

```bash
# Build
npm run build

# Deploy dist/ folder to Vercel/Netlify
vercel --prod
```

**Environment Variables:**
```
VITE_API_BASE_URL=https://your-backend-domain.com
```

### Option 4: Kubernetes (Production Scale)

```yaml
# backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chatbot-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: chatbot-backend
  template:
    metadata:
      labels:
        app: chatbot-backend
    spec:
      containers:
      - name: backend
        image: your-registry/chatbot-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: openai-secret
              key: api-key
        resources:
          limits:
            memory: "512Mi"
            cpu: "500m"
```

## Performance Optimization

### Frontend
- ✅ Memoization with `React.memo()`
- ✅ useCallback for event handlers
- ✅ Lazy loading with dynamic imports
- ✅ Code splitting with Vite
- ✅ LocalStorage caching

### Backend
- ✅ Request validation before API calls
- ✅ Connection pooling with httpx
- ✅ Rate limiting to prevent abuse
- ✅ Async request handling
- ✅ Message history trimming (max 40)

### API
- ✅ Token limits to control response size
- ✅ Temperature for response diversity
- ✅ Streaming for long responses (future)
- ✅ Caching of health checks

## Security Measures

1. **Input Validation**: Pydantic models validate all requests
2. **Input Sanitization**: Control characters removed
3. **Rate Limiting**: Per-IP request throttling
4. **CORS**: Only allowed origins can access backend
5. **Environment Variables**: Secrets never in code
6. **Error Messages**: Generic messages to users, detailed logs server-side
7. **Timeout**: 45-second timeout on API requests
8. **Character Limits**: Max 4000 chars input, 4096 output

## Monitoring & Logging

### Backend Logs
```
2026-03-22 11:30:45 | INFO | chatbot-api | chat_request_success conversation_id=abc123 ip=127.0.0.1
```

### Key Metrics to Monitor
- Request count per minute
- Average response time
- Error rate
- Rate limit hits
- API quota usage

### Frontend Monitoring
- Console errors
- Failed API requests
- LocalStorage quota usage
- Memory usage

## Scaling Strategy

### Phase 1: Single Server
- Local SQLite or in-memory store
- Single FastAPI process
- Static frontend on CDN

### Phase 2: Horizontal Scaling
- Docker containers
- Load balancer (nginx/HAProxy)
- Persistent database (PostgreSQL)
- Message queue (Redis) for sessions

### Phase 3: Microservices
- Separate API Gateway
- Chat service (multiple instances)
- API integration service
- User service
- Analytics service

## Backup & Recovery

### Data to Backup
- User conversations (if persisted)
- Configuration files
- Environment variables

### Disaster Recovery
1. Database backups (daily)
2. Version control (GitHub)
3. Environment variable backups (secure storage)
4. Docker image registry

## Conclusion

This architecture provides a solid foundation for a production-grade AI chatbot application with:
- Clear separation of concerns
- Type safety with TypeScript
- Professional UI/UX
- Scalable backend
- Easy deployment options
- Security best practices

For questions about specific components or deployment scenarios, refer to the individual service documentation.
