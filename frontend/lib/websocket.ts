/**
 * WebSocket client for real-time chat.
 */

export interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: number;
}

export interface WebSocketMessage {
  type: 'message' | 'system' | 'history' | 'user_count' | 'error' | 'pong';
  data?: any;
  message?: string;
}

export class ChatWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private username: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Set<(msg: WebSocketMessage) => void> = new Set();
  private errorHandlers: Set<(error: string) => void> = new Set();
  private statusHandlers: Set<(status: 'connected' | 'disconnected' | 'error') => void> = new Set();

  constructor(url: string, username: string) {
    this.url = url;
    this.username = username;
  }

  /**
   * Connect to WebSocket server.
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = new URL(this.url);
        wsUrl.searchParams.append('username', this.username);

        this.ws = new WebSocket(wsUrl.toString());

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.notifyStatus('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (event) => {
          console.error('WebSocket error:', event);
          this.notifyError('Connection error');
          this.notifyStatus('error');
          reject(new Error('WebSocket connection failed'));
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.stopHeartbeat();
          this.notifyStatus('disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from server.
   */
  disconnect(): void {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send a chat message.
   */
  sendMessage(content: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.notifyError('Not connected');
      return false;
    }

    try {
      this.ws.send(JSON.stringify({
        type: 'message',
        content: content,
      }));
      return true;
    } catch (error) {
      this.notifyError('Failed to send message');
      return false;
    }
  }

  /**
   * Subscribe to messages.
   */
  onMessage(handler: (msg: WebSocketMessage) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  /**
   * Subscribe to errors.
   */
  onError(handler: (error: string) => void): () => void {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  /**
   * Subscribe to status changes.
   */
  onStatus(handler: (status: 'connected' | 'disconnected' | 'error') => void): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  /**
   * Check if connected.
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  // Private methods

  private handleMessage(data: string): void {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      this.messageHandlers.forEach(handler => handler(message));
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  private notifyError(error: string): void {
    this.errorHandlers.forEach(handler => handler(error));
  }

  private notifyStatus(status: 'connected' | 'disconnected' | 'error'): void {
    this.statusHandlers.forEach(handler => handler(status));
  }

  private startHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.heartbeatInterval = setInterval(() => {
      if (this.isConnected()) {
        try {
          this.ws?.send(JSON.stringify({ type: 'pong' }));
        } catch (error) {
          console.error('Failed to send pong:', error);
        }
      }
    }, 30000); // Send pong every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, delay);
  }
}
