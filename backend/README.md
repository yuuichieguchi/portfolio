# Portfolio Backend

FastAPI backend for the portfolio website with real-time chat powered by WebSocket Stabilizer.

## Overview

This is the backend API server that:
- Manages WebSocket connections for real-time chat
- Validates and sanitizes user input
- Broadcasts messages to connected clients
- Provides REST API endpoints for statistics

## Project Structure

```
backend/
├── src/portfolio_backend/
│   ├── __init__.py              # Package initialization
│   ├── main.py                  # FastAPI application & routes
│   ├── config.py                # Configuration management
│   ├── chat.py                  # Chat management logic
│   ├── security.py              # Input validation & XSS prevention
│   └── exceptions.py            # Custom exception types
├── tests/
│   ├── __init__.py
│   └── test_security.py         # Security tests
├── pyproject.toml               # Project metadata & dependencies
├── .env.example                 # Environment variables template
└── README.md
```

## Installation

### Prerequisites
- Python 3.10 or higher
- pip (Python package manager)

### Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Copy environment file
cp .env.example .env

# Install dependencies
pip install -e .

# Or for development
pip install -e ".[dev]"
```

## Running the Server

### Development

```bash
# Run with auto-reload
uvicorn portfolio_backend.main:app --reload

# Or with custom host/port
uvicorn portfolio_backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production

```bash
# Run without auto-reload
uvicorn portfolio_backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

The server will be available at `http://localhost:8000`

API documentation available at `http://localhost:8000/docs` (Swagger UI)

## Configuration

Edit `.env` file:

```env
# Application
APP_NAME=Portfolio Backend
APP_VERSION=0.1.0
DEBUG=false

# Server
HOST=0.0.0.0
PORT=8000

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:8000
CORS_ALLOW_CREDENTIALS=true

# WebSocket
WS_HEARTBEAT_INTERVAL=30.0
WS_HEARTBEAT_TIMEOUT=60.0
WS_MAX_CONNECTIONS=1000

# Chat
MAX_MESSAGE_LENGTH=1000
MAX_USERNAME_LENGTH=50
```

## API Endpoints

### Health Check

```
GET /health
```

Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "service": "Portfolio Backend",
  "version": "0.1.0"
}
```

### Statistics

```
GET /api/stats
```

Get current chat statistics.

**Response:**
```json
{
  "active_users": 5,
  "total_messages": 42
}
```

### WebSocket

```
WS /ws/chat?username=<username>
```

Connect to real-time chat.

**Query Parameters:**
- `username` (required) - Username for chat

**Message Format:**

Send message:
```json
{
  "type": "message",
  "content": "Hello world"
}
```

Send pong (heartbeat response):
```json
{
  "type": "pong"
}
```

Receive message:
```json
{
  "type": "message",
  "data": {
    "id": "uuid",
    "username": "john_doe",
    "content": "Hello world",
    "timestamp": 1234567890.123
  }
}
```

Receive history:
```json
{
  "type": "history",
  "data": [...]
}
```

Receive user count:
```json
{
  "type": "user_count",
  "data": {
    "count": 5
  }
}
```

## Security Features

### Input Validation

- **Username**: Alphanumeric, hyphens, underscores only (max 50 chars)
- **Message**: Max 1000 characters
- **Length checks**: Prevents buffer overflow and DoS attacks

### XSS Prevention

- **HTML escaping**: All user input is HTML-escaped
- **Pattern matching**: Dangerous patterns (script tags, event handlers) are blocked
- **Sanitization**: Multiple layers of input sanitization

### WebSocket Security

- **Graceful error handling**: Errors don't crash the server
- **Connection timeout**: Dead connections are automatically removed
- **Proper cleanup**: Resources are freed on disconnect

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=portfolio_backend

# Run specific test file
pytest tests/test_security.py -v

# Run specific test
pytest tests/test_security.py::test_xss_prevention -v
```

## Code Quality

```bash
# Format code
black src/

# Lint code
ruff check src/

# Type check
mypy src/

# Run all checks
black src/ && ruff check src/ && mypy src/
```

## Architecture

### Components

1. **main.py**: FastAPI application, routes, WebSocket handler
2. **chat.py**: Chat management logic, message broadcasting
3. **config.py**: Configuration management using Pydantic Settings
4. **security.py**: Input validation and sanitization
5. **exceptions.py**: Custom exception types

### Request Flow

```
WebSocket Connection Request
    ↓
Validate username
    ↓
Create ChatWebSocket connection
    ↓
Send message history to client
    ↓
Broadcast "user joined" message
    ↓
Listen for incoming messages
    ↓
Validate & sanitize message
    ↓
Broadcast message to all clients
    ↓
Update message history
```

### Concurrent Connections

The backend can handle multiple concurrent WebSocket connections using:

- **asyncio**: Async/await for efficient I/O
- **WebSocket Stabilizer**: Connection pooling and management
- **Non-blocking I/O**: No blocking calls in async code

## Performance Considerations

- **Message history**: Limited to last 100 messages (configurable)
- **Heartbeat interval**: 30 seconds (configurable)
- **Connection timeout**: 60 seconds of inactivity (configurable)
- **Max connections**: 1000 (configurable)

## Monitoring

### Logging

The backend logs important events:

```
[INFO] User connected: john_doe
[INFO] Message from john_doe: Hello
[INFO] User disconnected: jane_doe
[ERROR] WebSocket error: Connection reset
```

### Health Checks

Use the `/health` endpoint for monitoring:

```bash
curl http://localhost:8000/health
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### CORS Errors

1. Check `CORS_ORIGINS` in `.env`
2. Ensure frontend URL is in the list
3. Restart the server

### WebSocket Connection Refused

1. Ensure backend is running
2. Check firewall settings
3. Verify WebSocket URL is correct

### High Memory Usage

1. Reduce `MAX_CONNECTIONS`
2. Reduce message history size
3. Check for connection leaks in logs

## Production Deployment

### Environment Setup

```bash
export DEBUG=false
export CORS_ORIGINS=https://yourdomain.com
export WS_HEARTBEAT_INTERVAL=30.0
```

### Running with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker portfolio_backend.main:app
```

### Docker

```bash
docker build -f Dockerfile.backend -t portfolio-backend .
docker run -p 8000:8000 -e DEBUG=false portfolio-backend
```

## Dependencies

### Core
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `pydantic-settings` - Configuration management

### WebSocket
- `fastapi-websocket-stabilizer` - WebSocket management

### Development
- `pytest` - Testing framework
- `pytest-asyncio` - Async test support
- `pytest-cov` - Coverage reporting
- `black` - Code formatter
- `ruff` - Linter
- `mypy` - Type checker

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FastAPI WebSocket Guide](https://fastapi.tiangolo.com/advanced/websockets/)
- [WebSocket Stabilizer](../../fastapi-websocket-stabilizer)
- [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)

## License

MIT License - See [LICENSE](../LICENSE) for details.
