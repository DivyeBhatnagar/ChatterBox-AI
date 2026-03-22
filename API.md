# API Documentation

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-backend-domain.com`

## Endpoints

### 1. Health Check

**GET** `/health`

Returns the server status and configuration.

#### Response (200 OK)

```json
{
  "status": "ok",
  "timestamp": "2026-03-22T11:30:45.123456",
  "environment": "development",
  "model": "openai/gpt-oss-120b"
}
```

#### cURL Example

```bash
curl http://localhost:8000/health
```

---

### 2. Send Message

**POST** `/chat`

Send a message and get an AI response.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "message": "What is the capital of France?",
  "history": [
    {
      "role": "user",
      "content": "Hello!",
      "timestamp": "2026-03-22T11:25:00Z"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you today?",
      "timestamp": "2026-03-22T11:25:05Z"
    }
  ],
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "stream": false,
  "temperature": 0.7,
  "max_tokens": 1024
}
```

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `message` | string | ✓ | - | User's message (1-4000 chars) |
| `history` | array | | [] | Previous messages in conversation |
| `conversation_id` | string | | UUID | Unique ID for this conversation |
| `stream` | boolean | | false | Enable streaming responses |
| `temperature` | number | | 0.7 | Creativity (0-2, higher = more creative) |
| `max_tokens` | number | | 1024 | Max response length (64-4096) |

#### Response (200 OK)

```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "response": "The capital of France is Paris, a city known for its iconic landmarks like the Eiffel Tower and Notre-Dame Cathedral.",
  "model": "openai/gpt-oss-120b",
  "timestamp": "2026-03-22T11:30:45.123456",
  "usage": {
    "prompt_tokens": 28,
    "completion_tokens": 35,
    "total_tokens": 63
  },
  "status": "success"
}
```

#### Error Responses

**400 Bad Request** - Invalid input
```json
{
  "error": "Message is empty after sanitization.",
  "code": "INVALID_INPUT",
  "status": "error"
}
```

**401 Unauthorized** - API key issue
```json
{
  "error": "Model provider authentication failed.",
  "code": "AUTHENTICATION_ERROR",
  "status": "error"
}
```

**429 Too Many Requests** - Rate limited
```json
{
  "error": "Too many requests. Please wait and try again.",
  "code": "RATE_LIMIT_EXCEEDED",
  "status": "error"
}
```

**503 Service Unavailable** - Upstream error
```json
{
  "error": "Temporary model service issue. Please try again.",
  "code": "UPSTREAM_ERROR",
  "status": "error"
}
```

#### cURL Examples

**Basic Request:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?"
  }'
```

**With Conversation History:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What about London?",
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
    "history": [
      {
        "role": "user",
        "content": "What is the capital of France?"
      },
      {
        "role": "assistant",
        "content": "Paris is the capital of France."
      }
    ]
  }'
```

**With Custom Parameters:**
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Write a creative story",
    "temperature": 1.5,
    "max_tokens": 2048
  }'
```

#### JavaScript Fetch Example

```javascript
const response = await fetch('http://localhost:8000/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: 'Hello!',
    history: [],
    temperature: 0.7,
    max_tokens: 1024,
  }),
});

const data = await response.json();
console.log(data.response);
```

#### Python Requests Example

```python
import requests

response = requests.post(
    'http://localhost:8000/chat',
    json={
        'message': 'Hello!',
        'history': [],
        'temperature': 0.7,
        'max_tokens': 1024,
    }
)

data = response.json()
print(data['response'])
```

---

## Rate Limiting

The API implements rate limiting per IP address:

- **Default**: 30 requests per 60 seconds
- **Limits**: Configurable via `RATE_LIMIT_REQUESTS` and `RATE_LIMIT_WINDOW_SECONDS`

When rate limited, the API returns:
- **Status**: 429 Too Many Requests
- **Error Code**: `RATE_LIMIT_EXCEEDED`
- **Message**: "Too many requests. Please wait and try again."

---

## Message History Structure

Messages in the history array must follow this format:

```json
{
  "role": "user|assistant|system",
  "content": "Message text",
  "timestamp": "2026-03-22T11:30:45Z"
}
```

- **role**: One of `user`, `assistant`, or `system`
- **content**: Message text (1-8000 characters)
- **timestamp**: ISO 8601 format (optional)

---

## Conversation Management

### Maintaining Context

The backend maintains the last 40 messages (20 exchanges) per conversation. Older messages are automatically trimmed.

### Conversation IDs

- First request: Don't include `conversation_id` - server generates one
- Subsequent requests: Include the `conversation_id` from previous responses
- This maintains context across multiple messages

---

## Best Practices

1. **Always include history** - Provide previous messages for context
2. **Use appropriate temperature** - Lower (0.3-0.7) for factual tasks, higher (0.8-1.2) for creative
3. **Manage token limits** - Higher `max_tokens` = longer response but higher cost
4. **Handle errors gracefully** - Implement retry logic for 503 errors
5. **Preserve conversation IDs** - Save them to maintain conversation context
6. **Sanitize user input** - Remove control characters before sending

---

## Authentication

Currently, the API does not require authentication. For production deployments, consider adding:

- API key validation
- JWT tokens
- OAuth 2.0

---

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (default frontend)
- Custom origins can be added via `ALLOWED_ORIGINS` environment variable

---

## Response Times

Typical response times:
- **Health check**: < 50ms
- **Chat response**: 2-10 seconds (depending on response length)
- **Rate limit check**: < 5ms

---

## Support

For API issues:
1. Check the error `code` field for specific issues
2. Review server logs for detailed information
3. Verify environment configuration
4. Test with cURL first before integrating into applications
