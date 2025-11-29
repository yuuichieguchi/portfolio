/**
 * Real-time chat component using WebSocket.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatWebSocket, ChatMessage, WebSocketMessage } from '@/lib/websocket';
import styles from './Chat.module.css';

interface ChatProps {
  apiUrl: string;
}

export default function Chat({ apiUrl }: ChatProps) {
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const wsRef = useRef<ChatWebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connect to chat
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usernameInput.trim()) {
      setError('Please enter a username');
      return;
    }

    if (usernameInput.length > 50) {
      setError('Username must be 50 characters or less');
      return;
    }

    // Validate username (alphanumeric, hyphen, underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(usernameInput)) {
      setError('Username can only contain letters, numbers, hyphens, and underscores');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      // Construct WebSocket URL
      // For browser-based WebSocket connections, we need to use the current window location
      // Extract base URL from apiUrl by removing '/api'
      const apiBaseUrl = apiUrl.replace(/\/api$/, '');

      // If API URL points to localhost, use it directly
      // Otherwise (Docker environment accessed via localhost), use current window location
      let wsBaseUrl = apiBaseUrl;

      if (apiBaseUrl.includes('portfolio-backend')) {
        // In Docker environment, replace container hostname with localhost
        // since browser cannot resolve container names
        wsBaseUrl = apiBaseUrl.replace('portfolio-backend', 'localhost');
      }

      const wsUrl = `${wsBaseUrl.replace(/^http/, 'ws')}/ws/chat`;
      wsRef.current = new ChatWebSocket(wsUrl, usernameInput);

      // Register handlers BEFORE connecting
      wsRef.current.onMessage((msg: WebSocketMessage) => {
        console.log('[DEBUG] onMessage received:', msg);
        if (msg.type === 'message' && msg.data) {
          console.log('[DEBUG] Adding message to state:', msg.data);
          setMessages(prev => [...prev, msg.data as ChatMessage]);
        } else if (msg.type === 'system' && msg.data) {
          const systemMsg = msg.data as ChatMessage;
          console.log('[DEBUG] Adding system message to state:', systemMsg);
          setMessages(prev => [...prev, systemMsg]);
        } else if (msg.type === 'history' && msg.data) {
          console.log('[DEBUG] Setting message history:', msg.data);
          setMessages(msg.data as ChatMessage[]);
        } else if (msg.type === 'user_count' && msg.data) {
          console.log('[DEBUG] Updating user count:', msg.data.count);
          setUserCount(msg.data.count);
        } else if (msg.type === 'error') {
          console.log('[DEBUG] Error message received:', msg.message);
          setError(msg.message || 'An error occurred');
        }
      });

      wsRef.current.onError((err: string) => {
        console.log('[DEBUG] onError received:', err);
        setError(err);
      });

      wsRef.current.onStatus((status) => {
        console.log('[DEBUG] onStatus changed:', status);
        if (status === 'connected') {
          setIsConnected(true);
          setIsConnecting(false);
          setError('');
        } else if (status === 'disconnected') {
          setIsConnected(false);
          setIsConnecting(false);
        } else if (status === 'error') {
          setIsConnected(false);
          setIsConnecting(false);
        }
      });

      await wsRef.current.connect();
      setUsername(usernameInput);
      setIsConnected(true);
      setIsConnecting(false);
      setError('');
    } catch (err) {
      setError('Failed to connect to chat');
      setIsConnecting(false);
    }
  };

  // Send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      return;
    }

    if (inputValue.length > 1000) {
      setError('Message must be 1000 characters or less');
      return;
    }

    if (!wsRef.current || !wsRef.current.isConnected()) {
      setError('Not connected to chat');
      return;
    }

    const success = wsRef.current.sendMessage(inputValue);
    if (success) {
      setInputValue('');
      setError('');
    } else {
      setError('Failed to send message');
    }
  };

  // Disconnect
  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    setIsConnected(false);
    setMessages([]);
    setUserCount(0);
    setUsername('');
  };

  if (!isConnected) {
    return (
      <section id="chat" className={styles.container}>
        <h2>Live Chat Demo</h2>
        <p className={styles.description}>
          Experience real-time WebSocket communication powered by the fastapi-websocket-stabilizer library.
          Connect with other visitors in real-time to see the technology in action.
        </p>

        <form onSubmit={handleConnect} className={styles.connectionForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={isConnecting}
              maxLength={50}
              pattern="[a-zA-Z0-9_\-]+"
              required
            />
            <small>Letters, numbers, hyphens, and underscores only</small>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.connectButton}
            disabled={isConnecting || !usernameInput.trim()}
          >
            {isConnecting ? 'Connecting...' : 'Join Chat'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section id="chat" className={styles.container}>
      <div className={styles.chatHeader}>
        <div>
          <h2>Live Chat</h2>
          <p className={styles.userInfo}>
            Logged in as <strong>{username}</strong> • {userCount} user{userCount !== 1 ? 's' : ''} online
          </p>
        </div>
        <button
          onClick={handleDisconnect}
          className={styles.disconnectButton}
        >
          Leave Chat
        </button>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No messages yet. Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.message} ${msg.username === 'System' ? styles.systemMessage : ''}`}
            >
              <div className={styles.messageHeader}>
                <strong className={styles.username}>{msg.username}</strong>
                <time className={styles.timestamp}>
                  {new Date(msg.timestamp * 1000).toLocaleTimeString()}
                </time>
              </div>
              <p className={styles.messageContent}>{msg.content}</p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSendMessage} className={styles.inputForm}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Type a message... (max 1000 characters)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            maxLength={1000}
            disabled={!isConnected}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!isConnected || !inputValue.trim()}
          >
            Send
          </button>
        </div>
        {inputValue.length > 0 && (
          <small className={styles.charCount}>
            {inputValue.length} / 1000
          </small>
        )}
      </form>
    </section>
  );
}
