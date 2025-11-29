"""Main application for portfolio backend."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uuid

from .config import settings
from .chat import ChatManager
from .security import MessageValidator
from dataclasses import dataclass
from datetime import timedelta


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Simple WebSocketConfig replacement (until library is installed)
@dataclass
class SimpleWebSocketConfig:
    """Simple WebSocket configuration."""
    heartbeat_interval: float = 30.0
    heartbeat_timeout: float = 60.0
    max_connections: int = 1000
    log_level: str = "INFO"


# Initialize chat manager
ws_config = SimpleWebSocketConfig(
    heartbeat_interval=settings.ws_heartbeat_interval,
    heartbeat_timeout=settings.ws_heartbeat_timeout,
    max_connections=settings.ws_max_connections,
    log_level="INFO",
)
chat_manager = ChatManager(ws_config)

# Validators
message_validator = MessageValidator()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle."""
    # Startup
    await chat_manager.start()
    logger.info("Chat manager started")
    yield
    # Shutdown
    report = await chat_manager.graceful_shutdown()
    logger.info(
        f"Chat manager shutdown: "
        f"closed={report.closed_count}, failed={report.failed_count}"
    )


# Create FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods,
    allow_headers=settings.cors_allow_headers,
)


# Routes
@app.get("/health")
async def health_check() -> dict:
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
    }


@app.get("/api/stats")
async def get_stats() -> dict:
    """Get chat statistics."""
    return {
        "active_users": chat_manager.get_connection_count(),
        "total_messages": len(chat_manager.message_history),
    }


@app.websocket("/ws/chat")
async def websocket_chat(
    websocket: WebSocket,
    username: str = Query(...)
) -> None:
    """WebSocket endpoint for real-time chat.

    Query parameters:
        username: Username for the chat (required)
    """
    await websocket.accept()

    # Validate username
    sanitized_username = message_validator.sanitize_username(
        username,
        max_length=settings.max_username_length
    )

    if not sanitized_username:
        await websocket.send_json({
            "type": "error",
            "message": "Invalid username"
        })
        await websocket.close(code=1008, reason="Invalid username")
        return

    # Generate client ID
    client_id = str(uuid.uuid4())

    try:
        # Connect user
        await chat_manager.connect(client_id, websocket, sanitized_username)
        await chat_manager.send_user_count()

        logger.info(f"User connected: {sanitized_username} ({client_id})")

        # Handle incoming messages
        while True:
            data = await websocket.receive_json()

            # Handle heartbeat pong
            if data.get("type") == "pong":
                await chat_manager.ws_manager.handle_pong(client_id)
                continue

            # Handle chat message
            if data.get("type") == "message":
                message_content = data.get("content", "").strip()

                # Validate message
                sanitized_message = message_validator.sanitize_message(
                    message_content,
                    max_length=settings.max_message_length
                )

                if not sanitized_message:
                    await websocket.send_json({
                        "type": "error",
                        "message": "Invalid message"
                    })
                    continue

                # Check for dangerous patterns
                if message_validator.is_dangerous(sanitized_message):
                    logger.warning(
                        f"Dangerous message from {sanitized_username}: "
                        f"{message_content}"
                    )
                    await websocket.send_json({
                        "type": "error",
                        "message": "Message contains invalid content"
                    })
                    continue

                # Store and broadcast message
                await chat_manager.send_message(
                    client_id,
                    sanitized_username,
                    sanitized_message
                )

                logger.info(
                    f"Message from {sanitized_username}: {sanitized_message}"
                )

    except WebSocketDisconnect:
        await chat_manager.disconnect(client_id)
        await chat_manager.send_user_count()
        logger.info(f"User disconnected: {sanitized_username} ({client_id})")

    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        try:
            await chat_manager.disconnect(client_id)
        except Exception:
            pass


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions."""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
