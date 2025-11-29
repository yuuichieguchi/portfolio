"""Security utilities for chat messages and user input."""

import html
import re
from typing import Optional


class MessageValidator:
    """Validates and sanitizes chat messages for security."""

    # XSS prevention: allowed HTML tags (very minimal)
    ALLOWED_TAGS: set[str] = set()

    # SQL injection and command injection prevention: disallowed patterns
    DANGEROUS_PATTERNS = [
        r"<script",
        r"javascript:",
        r"on\w+\s*=",
        r"<iframe",
        r"<object",
        r"<embed",
        r"<img[^>]*src",
    ]

    @staticmethod
    def sanitize_message(message: str, max_length: int = 1000) -> Optional[str]:
        """Sanitize a message for security.

        Args:
            message: Raw message from user
            max_length: Maximum allowed message length

        Returns:
            Sanitized message or None if invalid
        """
        # Check length
        if not message or len(message) > max_length:
            return None

        # Remove leading/trailing whitespace
        message = message.strip()

        # Check if message is empty after trimming
        if not message:
            return None

        # HTML escape to prevent XSS
        message = html.escape(message)

        return message

    @staticmethod
    def sanitize_username(username: str, max_length: int = 50) -> Optional[str]:
        """Sanitize a username for security.

        Args:
            username: Raw username from user
            max_length: Maximum allowed username length

        Returns:
            Sanitized username or None if invalid
        """
        # Check length
        if not username or len(username) > max_length:
            return None

        # Remove leading/trailing whitespace
        username = username.strip()

        # Check if username is empty after trimming
        if not username:
            return None

        # Only allow alphanumeric, underscore, hyphen
        if not re.match(r"^[a-zA-Z0-9_-]+$", username):
            return None

        # HTML escape
        username = html.escape(username)

        return username

    @staticmethod
    def is_dangerous(message: str) -> bool:
        """Check if message contains dangerous patterns.

        Args:
            message: Message to check

        Returns:
            True if dangerous patterns found
        """
        message_lower = message.lower()
        for pattern in MessageValidator.DANGEROUS_PATTERNS:
            if re.search(pattern, message_lower, re.IGNORECASE):
                return True
        return False
