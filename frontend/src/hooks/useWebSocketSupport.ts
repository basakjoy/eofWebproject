'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getWebSocketUrl } from '@/lib/apiUrl';

export interface SupportChatMessage {
  id?: string;
  type?: string;
  content: string;
  ticketId?: string;
  userId?: string;
  userName?: string;
  timestamp: number;
  senderType: 'customer' | 'agent' | 'system';
}

export interface UseWebSocketSupportOptions {
  onMessageReceived?: (message: SupportChatMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export function useWebSocketSupport(options: UseWebSocketSupportOptions = {}) {
  const { user, token } = useAuthStore();
  const ws = useRef<WebSocket | null>(null);
  const connectRef = useRef<() => void>(() => {});
  const disconnectRef = useRef<() => void>(() => {});
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState<SupportChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const optionsRef = useRef<UseWebSocketSupportOptions>(options);
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    if (ws.current) {
      try {
        ws.current.close();
      } catch {}
      ws.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(() => {
    if (!token || !user) {
      return;
    }

    const authToken = token.replace(/^Bearer\s+/i, '').trim();
    if (!authToken) {
      return;
    }

    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    setIsConnecting(true);

    try {
      const url = `${getWebSocketUrl()}?token=${encodeURIComponent(authToken)}`;

      const socket = new WebSocket(url);
      ws.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
        optionsRef.current.onConnect?.();
      };

      socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'init') {
            if (data.ticketId) {
              setTicketId(data.ticketId);
            }
            if (Array.isArray(data.messages)) {
              setMessages(data.messages);
            }
          } else if (data.type === 'message' && data.content) {
            const newMsg: SupportChatMessage = {
              id: data.id || `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              content: data.content,
              ticketId: data.ticketId,
              userId: data.userId,
              userName: data.userName,
              timestamp: data.timestamp || Date.now(),
              senderType: data.senderType || 'customer',
            };

            setMessages((prev) => {
              // Deduplicate by id if available, or timestamp+content
              if (newMsg.id && prev.some((m) => m.id === newMsg.id)) {
                return prev;
              }
              if (
                prev.some(
                  (m) =>
                    m.content === newMsg.content &&
                    Math.abs(m.timestamp - newMsg.timestamp) < 2000 &&
                    m.senderType === newMsg.senderType
                )
              ) {
                return prev;
              }
              return [...prev, newMsg];
            });

            optionsRef.current.onMessageReceived?.(newMsg);
          } else if (data.type === 'typing') {
            const typingState = data.isTyping !== false;
            setIsTyping(typingState);
            setTypingUser(typingState ? data.userName || 'Support Agent' : null);

            if (typingTimerRef.current) {
              clearTimeout(typingTimerRef.current);
            }

            if (typingState) {
              typingTimerRef.current = setTimeout(() => {
                setIsTyping(false);
                setTypingUser(null);
              }, 4000);
            }
          }
        } catch (err) {
          console.error('[useWebSocketSupport] Error parsing incoming message:', err);
        }
      };

      socket.onerror = (event) => {
        console.error('[useWebSocketSupport] WebSocket connection failed:', { url, event });
        optionsRef.current.onError?.(new Error(`WebSocket connection failed for ${url}`));
      };

      socket.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        optionsRef.current.onDisconnect?.();

        if (event.code !== 1000) {
          console.warn('[useWebSocketSupport] WebSocket closed unexpectedly:', {
            code: event.code,
            reason: event.reason || 'No reason provided',
          });
        }

        // Reconnect if not cleanly closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1500 * Math.pow(2, reconnectAttemptsRef.current - 1), 20000);
          reconnectTimeoutRef.current = setTimeout(() => {
            connectRef.current();
          }, delay);
        }
      };
    } catch (err: unknown) {
      setIsConnecting(false);
      optionsRef.current.onError?.(err instanceof Error ? err : new Error('Connection failed'));
    }
  }, [token, user]);

  useEffect(() => {
    connectRef.current = connect;
    disconnectRef.current = disconnect;
  }, [connect, disconnect]);

  const sendMessage = useCallback((content: string): boolean => {
    const text = content.trim();
    if (!text) return false;

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      optionsRef.current.onError?.(new Error('Support chat is not connected'));
      return false;
    }

    try {
      ws.current.send(
        JSON.stringify({
          type: 'message',
          content: text,
          timestamp: Date.now(),
        })
      );
      return true;
    } catch (err: unknown) {
      optionsRef.current.onError?.(err instanceof Error ? err : new Error('Failed to send'));
      return false;
    }
  }, []);

  const sendTypingIndicator = useCallback((typing: boolean = true) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    try {
      ws.current.send(
        JSON.stringify({
          type: 'typing',
          isTyping: typing,
          timestamp: Date.now(),
        })
      );
    } catch {}
  }, []);

  // Connect on mount or auth change
  useEffect(() => {
    if (token && user) {
      connectRef.current();
    } else {
      disconnectRef.current();
    }

    return () => {
      disconnectRef.current();
    };
  }, [token, user, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    messages,
    isTyping,
    typingUser,
    ticketId,
    sendMessage,
    sendTypingIndicator,
    reconnect: connect,
    disconnect,
    setMessages,
  };
}
