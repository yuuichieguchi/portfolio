"""Chat management with WebSocket support."""

import asyncio
import json
import time
import uuid
from dataclasses import dataclass, asdict, field
from typing import Optional, Dict, Any


@dataclass
class WebSocketConnectionMetadata:
    """Metadata for a WebSocket connection."""
    username: str = ""
    connected_at: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)

    def get(self, key: str, default: Any = None) -> Any:
        """Get metadata value."""
        return self.metadata.get(key, default)


@dataclass
class WebSocketConnection:
    """Represents a WebSocket connection."""
    client_id: str
    websocket: Any
    metadata: Dict[str, Any] = field(default_factory=dict)


class SimpleWebSocketConnectionManager:
    """Simple WebSocket connection manager for development."""

    def __init__(self, config: Optional[Any] = None) -> None:
        """Initialize connection manager."""
        self.config = config
        self._connections: Dict[str, WebSocketConnection] = {}

    async def start(self) -> None:
        """Start the manager."""
        pass

    async def connect(
        self,
        client_id: str,
        websocket: Any,
        metadata: Optional[Dict[str, Any]] = None
    ) -> None:
        """Connect a client."""
        self._connections[client_id] = WebSocketConnection(
            client_id=client_id,
            websocket=websocket,
            metadata=metadata or {}
        )

    async def disconnect(self, client_id: str) -> None:
        """Disconnect a client."""
        if client_id in self._connections:
            del self._connections[client_id]

    async def broadcast(
        self,
        message: Dict[str, Any],
        exclude_client: Optional[str] = None
    ) -> None:
        """Broadcast message to all connected clients."""
        import logging
        logger = logging.getLogger(__name__)
        for client_id, connection in self._connections.items():
            if exclude_client and client_id == exclude_client:
                continue
            try:
                logger.info(f"Sending message to client {client_id}")
                await connection.websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending to client {client_id}: {e}")

    async def send_to_client(
        self,
        client_id: str,
        message: Dict[str, Any]
    ) -> None:
        """Send message to a specific client."""
        if client_id in self._connections:
            try:
                await self._connections[client_id].websocket.send_json(message)
            except Exception:
                pass

    def get_connection_count(self) -> int:
        """Get number of active connections."""
        return len(self._connections)

    async def handle_pong(self, client_id: str) -> None:
        """Handle pong message from client."""
        pass

    async def graceful_shutdown(self, timeout: float = 30.0):
        """Gracefully shutdown all connections."""
        # Simple shutdown report
        @dataclass
        class ShutdownReport:
            closed_count: int = 0
            failed_count: int = 0

        return ShutdownReport(closed_count=len(self._connections), failed_count=0)


@dataclass
class ChatMessage:
    """Represents a chat message."""

    id: str
    username: str
    content: str
    timestamp: float

    def to_dict(self) -> dict:
        """Convert to dictionary."""
        return asdict(self)


class ChatManager:
    """Manages chat connections and message broadcasting."""

    def __init__(self, config: Optional[Any] = None) -> None:
        """Initialize chat manager.

        Args:
            config: WebSocket configuration
        """
        self.ws_manager = SimpleWebSocketConnectionManager(config)
        self.message_history: list[ChatMessage] = []
        self.max_history_size = 100

    async def start(self) -> None:
        """Start the chat manager."""
        await self.ws_manager.start()

    async def connect(self, client_id: str, websocket, username: str) -> None:
        """Register a new chat connection.

        Args:
            client_id: Unique client identifier
            websocket: WebSocket connection
            username: Username for chat
        """
        await self.ws_manager.connect(
            client_id,
            websocket,
            metadata={"username": username, "connected_at": time.time()}
        )

        # Send chat history to new user
        await self.send_history(client_id)

        # Notify others of new user
        await self.broadcast_system_message(
            f"{username} joined the chat",
            exclude_client=client_id
        )

    async def disconnect(self, client_id: str) -> None:
        """Disconnect a client.

        Args:
            client_id: Client identifier
        """
        # Get username before disconnecting
        connections = self.ws_manager._connections
        username = "Unknown"
        if client_id in connections:
            username = connections[client_id].metadata.get("username", "Unknown")

        await self.ws_manager.disconnect(client_id)

        # Notify others of user leaving
        await self.broadcast_system_message(f"{username} left the chat")

    def _get_bot_response(self, message: str) -> Optional[str]:
        """Generate bot response based on message content.

        Args:
            message: User message content (lowercase for matching)

        Returns:
            Bot response string or None if no match
        """
        message_lower = message.lower()

        responses = {
            "hello": "Hi there! 👋 Welcome to the WebSocket demo!",
            "hi": "Hello! Thanks for visiting 👋",
            "how are you": "I'm just a simple bot, but I'm working great! 🤖",
            "thanks": "You're welcome! 😊",
            "thank you": "Happy to help! 😊",
            "help": "I'm a demo bot that responds to basic greetings. Try saying 'hello', 'how are you', or 'what is websocket'!",
            "what is websocket": "WebSockets provide full-duplex communication channels over a single TCP connection. They enable real-time, bidirectional communication between clients and servers! 🚀",
            "websocket": "WebSockets are awesome for real-time applications! This chat is powered by them.",
            "bye": "Goodbye! Thanks for trying the demo! 👋",
            "good bye": "Goodbye! Thanks for trying the demo! 👋",
        }

        for keyword, response in responses.items():
            if keyword in message_lower:
                return response

        return None

    async def send_message(
        self,
        client_id: str,
        username: str,
        content: str,
    ) -> Optional[ChatMessage]:
        """Send a chat message.

        Args:
            client_id: Client identifier
            username: Username
            content: Message content (already sanitized)

        Returns:
            ChatMessage if successful, None otherwise
        """
        import logging
        logger = logging.getLogger(__name__)

        message = ChatMessage(
            id=str(uuid.uuid4()),
            username=username,
            content=content,
            timestamp=time.time()
        )

        # Add to history
        self.message_history.append(message)

        # Trim history if too large
        if len(self.message_history) > self.max_history_size:
            self.message_history = self.message_history[-self.max_history_size:]

        # Broadcast message
        logger.info(f"[SEND_MESSAGE] About to broadcast message from {username}: {content}")
        logger.info(f"[SEND_MESSAGE] Connection count before broadcast: {len(self.ws_manager._connections)}")
        await self.broadcast_message(message)
        logger.info(f"[SEND_MESSAGE] Broadcast complete")

        # Generate and broadcast bot response if triggered
        bot_response = self._get_bot_response(content)
        if bot_response:
            await asyncio.sleep(0.5)  # Small delay to feel more natural
            bot_message = ChatMessage(
                id=str(uuid.uuid4()),
                username="Bot",
                content=bot_response,
                timestamp=time.time()
            )
            self.message_history.append(bot_message)
            await self.broadcast_message(bot_message)
            logger.info(f"[BOT_RESPONSE] Bot responded to message from {username}")

        return message

    async def broadcast_message(self, message: ChatMessage) -> None:
        """Broadcast a chat message to all clients.

        Args:
            message: Message to broadcast
        """
        import logging
        logger = logging.getLogger(__name__)

        payload = {
            "type": "message",
            "data": message.to_dict()
        }

        logger.info(f"[BROADCAST_MESSAGE] Payload: {payload}")
        logger.info(f"[BROADCAST_MESSAGE] Broadcasting message to {len(self.ws_manager._connections)} clients")
        await self.ws_manager.broadcast(payload)
        logger.info(f"[BROADCAST_MESSAGE] Broadcast sent")

    async def broadcast_system_message(
        self,
        content: str,
        exclude_client: Optional[str] = None
    ) -> None:
        """Broadcast a system message.

        Args:
            content: System message content
            exclude_client: Optional client to exclude
        """
        system_message = ChatMessage(
            id=str(uuid.uuid4()),
            username="System",
            content=content,
            timestamp=time.time()
        )

        payload = {
            "type": "system",
            "data": system_message.to_dict()
        }

        await self.ws_manager.broadcast(payload, exclude_client=exclude_client)

    async def send_history(self, client_id: str) -> None:
        """Send message history to a client.

        Args:
            client_id: Client identifier
        """
        payload = {
            "type": "history",
            "data": [msg.to_dict() for msg in self.message_history[-50:]]
        }

        await self.ws_manager.send_to_client(client_id, payload)

    async def send_user_count(self) -> None:
        """Broadcast current user count."""
        count = self.ws_manager.get_connection_count()
        payload = {
            "type": "user_count",
            "data": {"count": count}
        }

        await self.ws_manager.broadcast(payload)

    async def graceful_shutdown(self, timeout: float = 30.0):
        """Gracefully shutdown the chat manager.

        Args:
            timeout: Shutdown timeout in seconds

        Returns:
            Shutdown report
        """
        return await self.ws_manager.graceful_shutdown(timeout)

    def get_connection_count(self) -> int:
        """Get current connection count."""
        return self.ws_manager.get_connection_count()
