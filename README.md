# ChatterBox AI 🤖

**Built by [Divye Bhatnagar](https://github.com/DivyeBhatnagar)**

> An elegant, modern AI chatbot application with advanced conversational capabilities, enterprise-grade security, and a beautiful user interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org)

---

## ✨ Features

### 🎨 Frontend Excellence
- **Modern React + TypeScript** - Type-safe, production-ready code
- **Elegant Dark Theme** - Professionally designed UI inspired by leading AI platforms
- **Smooth Animations** - CSS-powered animations for delightful interactions
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Real-time Chat Interface** - Typing indicators and live message updates
- **Message Management** - Copy, search, regenerate, and clear conversations
- **Settings Customization** - Adjust temperature, tokens, and preferences
- **Markdown Support** - Beautifully formatted responses with syntax highlighting
- **Local Storage** - Persistent conversation history and settings
- **Accessibility First** - WCAG compliant with proper ARIA labels

### 🔧 Backend Capabilities
- **FastAPI Framework** - Fast, modern Python web framework
- **OpenAI Compatible API** - Works with NVIDIA's endpoint and other providers
- **Smart Rate Limiting** - Request throttling for fair resource usage
- **Context Awareness** - Multi-turn conversations with full message history
- **Security First** - Input validation, error handling, and CORS support
- **Scalable Architecture** - Designed for growth and high availability
- **Health Monitoring** - Built-in status endpoints and logging
- **Intelligent Retries** - Automatic retry logic with exponential backoff

### 🎯 Design & UX
- **MONOLITH Design System** - Cohesive, modern visual language
- **Custom CSS Animations** - Smooth entrance and interaction animations
- **Interactive Elements** - Engaging buttons, forms, and navigation
- **Loading States** - Clear feedback during async operations
- **Error Recovery** - Helpful error messages and recovery flows
- **Landing Page** - Compelling hero, features, and CTA sections

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **Python** 3.9+ ([Download](https://www.python.org))
- **npm** or **yarn** (comes with Node.js)
- **API Key** from [NVIDIA Build](https://build.nvidia.com/) or OpenAI

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/DivyeBhatnagar/ChatterBox-AI.git
cd chatterbox-ai
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env  # Create .env file and add your API key
```

**Environment Variables (.env):**
```env
OPENAI_API_KEY=your_api_key_here
OPENAI_API_BASE=https://integrate.api.nvidia.com/v1
OPENAI_MODEL=nvidia/meta-llama2-70b-chat
ENVIRONMENT=development
```

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### 4️⃣ Run Backend

```bash
# From backend directory (with virtual environment activated)
python main.py
```

Backend will run on `http://localhost:8000`

---

## 📁 Project Structure

```
chatterbox-ai/
├── frontend/                          # React + TypeScript application
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── landing/              # Landing page components
│   │   │   ├── auth/                 # Authentication UI
│   │   │   ├── shared/               # Shared layout components
│   │   │   └── ui/                   # Reusable UI elements
│   │   ├── context/                  # React Context for state management
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── lib/                      # Utilities and API client
│   │   ├── routes/                   # Route protection and navigation
│   │   ├── styles/                   # Global styles and animations
│   │   ├── types/                    # TypeScript type definitions
│   │   └── firebase/                 # Firebase configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts               # Vite build configuration
│   └── tailwind.config.js            # Tailwind CSS configuration
│
├── backend/                           # FastAPI Python application
│   ├── app/
│   │   ├── main.py                  # Application entry point
│   │   ├── config.py                # Configuration management
│   │   ├── auth.py                  # Authentication logic
│   │   ├── models.py                # Data models
│   │   ├── rate_limit.py            # Rate limiting logic
│   │   └── services/                # Business logic
│   │       ├── openai_client.py     # OpenAI API integration
│   │       └── firestore_service.py # Firebase Firestore
│   ├── main.py                      # Application startup
│   ├── requirements.txt             # Python dependencies
│   └── firebase-service-account.json # Firebase credentials
│
├── README.md                         # This file
├── API.md                           # API documentation
├── ARCHITECTURE.md                  # System architecture
├── DOCKER.md                        # Docker setup guide
├── GETTING_STARTED.md              # Detailed getting started guide
└── start.sh                         # Quick start script
```

---

## 🔌 API Endpoints

### Health Check
```bash
GET /health
```

### Chat Completion
```bash
POST /chat
Content-Type: application/json

{
  "message": "Hello, how are you?",
  "temperature": 0.7,
  "max_tokens": 512
}
```

### Clear History
```bash
POST /chat/clear
```

For detailed API documentation, see [API.md](./API.md)

---

## 🛠️ Technology Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18+ | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router | Navigation |
| Firebase | Authentication |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | Web framework |
| Python 3.9+ | Language |
| OpenAI SDK | LLM integration |
| Firestore | Database |
| Uvicorn | ASGI server |
| Pydantic | Data validation |

---

## 🎨 Design System

ChatterBox AI uses the **MONOLITH Design System** featuring:

- **Color Palette**: Dark mode with accent colors
- **Typography**: Custom headline and body fonts
- **Spacing**: 8px-based scale for consistency
- **Components**: Reusable, documented UI elements
- **Animations**: Smooth CSS transitions and keyframes
- **Accessibility**: WCAG 2.1 AA compliance

---

## 🔐 Security Features

✅ **Input Validation** - All user inputs are sanitized
✅ **Rate Limiting** - Protection against abuse
✅ **CORS Configuration** - Controlled cross-origin access
✅ **Error Handling** - Secure error messages
✅ **Environment Variables** - Sensitive data protection
✅ **Authentication** - Firebase-based user authentication

---

## 🐳 Docker Support

Run the application in Docker containers:

```bash
# Build and run with Docker
docker-compose up --build
```

See [DOCKER.md](./DOCKER.md) for detailed Docker setup instructions.

---

## 📚 Documentation

- **[API Documentation](./API.md)** - Complete API reference
- **[Architecture Guide](./ARCHITECTURE.md)** - System design and deployment
- **[Getting Started](./GETTING_STARTED.md)** - Detailed setup walkthrough

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙋 Support

If you encounter any issues or have questions:

1. **Check existing issues** - Browse [GitHub Issues](https://github.com/DivyeBhatnagar/ChatterBox-AI/issues)
2. **Read documentation** - Review [GETTING_STARTED.md](./GETTING_STARTED.md)
3. **Create an issue** - [Report a bug or request feature](https://github.com/DivyeBhatnagar/ChatterBox-AI/issues/new)

---

## 🚀 Roadmap

- [ ] Voice input/output support
- [ ] Conversation export (PDF, Markdown)
- [ ] Advanced prompt engineering tools
- [ ] Multi-model selection
- [ ] Team collaboration features
- [ ] Custom model fine-tuning
- [ ] Mobile app (React Native)

---

## 👥 Team

Built with ❤️ by **Divye Bhatnagar**

- **Developer & Creator** - [Divye Bhatnagar](https://github.com/DivyeBhatnagar)

---

<div align="center">

**[⬆ back to top](#chatterbox-ai-)**

Made with 🎨 and ☕ by **Divye Bhatnagar** | [Report Bug](https://github.com/DivyeBhatnagar/ChatterBox-AI/issues) | [Request Feature](https://github.com/DivyeBhatnagar/ChatterBox-AI/issues)

</div>
