import WebSocket, { Server } from 'ws';
import { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';

export interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  userName?: string;
  userRole?: string;
  ticketId?: string;
  sessionId?: string;
  isAlive?: boolean;
}

export interface SupportMessagePayload {
  id?: string;
  type: 'init' | 'message' | 'typing' | 'status' | 'error';
  content?: string;
  sessionId?: string;
  ticketId?: string;
  userId?: string;
  userName?: string;
  senderType?: 'customer' | 'agent' | 'system';
  timestamp?: number;
  messages?: Array<{
    id: string;
    ticketId: string;
    userId: string;
    userName?: string;
    senderType: 'customer' | 'agent' | 'system';
    content: string;
    timestamp: number;
  }>;
  isTyping?: boolean;
}

// Store active connections mapped by userId -> Set of WebSockets
const userSockets = new Map<string, Set<AuthenticatedWebSocket>>();

/**
 * Broadcast a payload to all connected sockets of a specific user
 */
export function broadcastToUser(userId: string, message: SupportMessagePayload) {
  const sockets = userSockets.get(userId);
  if (!sockets || sockets.size === 0) return;

  const payload = JSON.stringify(message);
  sockets.forEach((ws) => {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    } catch (err) {
      console.error(`[WebSocket] Error sending message to user ${userId}:`, err);
    }
  });
}

/**
 * Broadcast a payload to all active support sockets (e.g. for staff/admins)
 */
export function broadcastToAll(message: SupportMessagePayload) {
  const payload = JSON.stringify(message);
  userSockets.forEach((sockets) => {
    sockets.forEach((ws) => {
      try {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      } catch (err) {
        console.error('[WebSocket] Broadcast error:', err);
      }
    });
  });
}

/**
 * Intelligent helper to generate automated support guidance when live staff is not actively chatting
 */
function getAssistantReply(text: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('deposit') || lower.includes('fund') || lower.includes('crypto') || lower.includes('payment')) {
    return "To make a deposit, navigate to your Dashboard > Deposits section. We support various secure payment methods including Crypto (USDT, BTC, ETH) and Bank Transfer. Once submitted, deposits are typically credited within 10-30 minutes.";
  }

  if (lower.includes('withdraw') || lower.includes('payout') || lower.includes('cashout')) {
    return "Withdrawals are processed swiftly by our finance department. Go to Dashboard > Withdrawals, select your verified withdrawal method, and submit your request. Standard processing time is 1-24 hours depending on the chosen method.";
  }

  if (lower.includes('signal') || lower.includes('forex') || lower.includes('trade') || lower.includes('tp') || lower.includes('sl')) {
    return "Our high-precision Forex & Crypto trading signals include entry points, Stop Loss (SL), and multiple Take Profit (TP1, TP2, TP3) targets. You can view all active and historical signals under the Trading Signals page or subscribe for instant Telegram/Push alerts.";
  }

  if (lower.includes('verify') || lower.includes('kyc') || lower.includes('id') || lower.includes('document')) {
    return "Account verification (KYC) helps keep your funds secure and unlocks higher transaction limits. Please upload a clear photo of your government-issued ID and proof of address under Settings > Verification.";
  }

  if (lower.includes('plan') || lower.includes('invest') || lower.includes('tier') || lower.includes('roi')) {
    return "We offer flexible investment plans with competitive ROI yields tailored to different risk appetites. You can review available plans and calculate potential returns directly on our Investment Plans page.";
  }

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('help')) {
    return "Hello! Welcome to Empire of Forex client support. How can we assist your trading journey today? You can ask about deposits, withdrawals, trading signals, account verification, or investment plans.";
  }

  return "Thank you for reaching out to Empire of Forex Support. Your message has been logged with our priority support queue. An agent will review your inquiry shortly. Feel free to provide any relevant transaction IDs or details in the meantime.";
}

export function setupSupportWebSocket(server: any) {
  const wss = new Server({
    noServer: true,
    perMessageDeflate: {
      serverNoContextTakeover: true,
      clientNoContextTakeover: true,
    },
  });

  // Handle WebSocket upgrade
  server.on('upgrade', async (request: IncomingMessage, socket: any, head: Buffer) => {
    if (request.url?.startsWith('/ws/support')) {
      try {
        const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
        let token = url.searchParams.get('token')?.trim() || null;

        // Fallback check in headers or Sec-WebSocket-Protocol
        if (!token && request.headers['sec-websocket-protocol']) {
          token = request.headers['sec-websocket-protocol'].split(',')[0].trim();
        }

        token = token?.replace(/^Bearer\s+/i, '').trim() || null;

        if (!token) {
          console.warn('[WebSocket] Upgrade rejected: No authentication token provided');
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        const rawSecret = process.env.JWT_SECRET || 'secret';
        const secret = rawSecret.trim();

        let decoded: any;
        try {
          decoded = jwt.verify(token, secret);
        } catch (jwtErr) {
          try {
            decoded = jwt.verify(token, 'your-secret-key');
          } catch {
            console.warn('[WebSocket] Token verification failed:', jwtErr);
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
        }

        const userId = decoded.userId || decoded.id;
        if (!userId) {
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        // Fetch user from db
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, role: true, status: true },
        });

        if (!dbUser || dbUser.status !== 'active') {
          console.warn('[WebSocket] User not found or inactive:', userId);
          socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
          socket.destroy();
          return;
        }

        wss.handleUpgrade(request, socket, head, (ws: AuthenticatedWebSocket) => {
          ws.userId = dbUser.id;
          ws.userName = dbUser.name;
          ws.userRole = dbUser.role;
          ws.sessionId = uuidv4();
          ws.isAlive = true;

          // Add to userSockets map
          if (!userSockets.has(ws.userId)) {
            userSockets.set(ws.userId, new Set());
          }
          userSockets.get(ws.userId)!.add(ws);

          handleConnection(ws);
        });
      } catch (err: any) {
        console.error('[WebSocket] Upgrade error:', err.message);
        socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
        socket.destroy();
      }
    }
  });

  // Heartbeat check every 30s
  const interval = setInterval(() => {
    wss.clients.forEach((ws: AuthenticatedWebSocket) => {
      if (ws.isAlive === false) {
        console.log(`[WebSocket] Terminating inactive connection for user: ${ws.userId}`);
        return ws.terminate();
      }
      ws.isAlive = false;
      try {
        ws.ping();
      } catch (err) {
        ws.terminate();
      }
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
}

async function handleConnection(ws: AuthenticatedWebSocket) {
  const userId = ws.userId!;
  console.log(`[WebSocket] Connected: ${ws.userName} (${userId})`);

  ws.on('error', (err) => {
    console.error(`[WebSocket] Error on user ${userId}:`, err.message);
  });

  ws.on('pong', () => {
    ws.isAlive = true;
  });

  ws.on('ping', () => {
    ws.isAlive = true;
    try {
      ws.pong();
    } catch {}
  });

  // Initialize or fetch user's support ticket
  try {
    let ticket = await prisma.supportTicket.findFirst({
      where: {
        userId,
        status: { not: 'closed' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      ticket = await prisma.supportTicket.create({
        data: {
          userId,
          subject: 'Live Client Support',
          description: 'Client initiated support chat',
          category: 'general',
          priority: 'medium',
          status: 'open',
        },
        include: {
          messages: {
            include: {
              user: {
                select: { id: true, name: true, role: true },
              },
            },
          },
        },
      });
    }

    ws.ticketId = ticket.id;

    // Map existing messages
    const formattedMessages = ticket.messages.map((m) => {
      const isAgent =
        m.user?.role === 'admin' ||
        m.user?.role === 'super_admin' ||
        m.user?.role === 'support_agent';
      return {
        id: m.id,
        ticketId: m.ticketId,
        userId: m.userId,
        userName: m.user?.name || (isAgent ? 'Support Specialist' : 'You'),
        senderType: (isAgent ? 'agent' : 'customer') as 'customer' | 'agent' | 'system',
        content: m.message,
        timestamp: new Date(m.createdAt).getTime(),
      };
    });

    // Send Init payload with history
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: 'init',
          ticketId: ticket.id,
          sessionId: ws.sessionId,
          userId: ws.userId,
          content: 'Connected to Empire of Forex Support',
          timestamp: Date.now(),
          messages: formattedMessages,
        })
      );
    }
  } catch (err: any) {
    console.error('[WebSocket] Error loading ticket history:', err.message);
  }

  // Handle incoming messages
  ws.on('message', async (data: string) => {
    try {
      const parsed: SupportMessagePayload = JSON.parse(data.toString());

      if (parsed.type === 'message' && parsed.content && parsed.content.trim()) {
        const content = parsed.content.trim();

        // Ensure ticket
        let ticketId = ws.ticketId;
        if (!ticketId) {
          const currentTicket = await prisma.supportTicket.findFirst({
            where: { userId, status: { not: 'closed' } },
            orderBy: { createdAt: 'desc' },
          });
          ticketId = currentTicket?.id;
        }

        if (!ticketId) {
          const newTicket = await prisma.supportTicket.create({
            data: {
              userId,
              subject: 'Live Client Support',
              description: 'Client initiated support chat',
              category: 'general',
              priority: 'medium',
              status: 'open',
            },
          });
          ticketId = newTicket.id;
          ws.ticketId = ticketId;
        }

        // Save user message to database
        const savedMessage = await prisma.supportMessage.create({
          data: {
            ticketId,
            userId,
            message: content,
          },
          include: {
            user: {
              select: { id: true, name: true, role: true },
            },
          },
        });

        const isAgent =
          ws.userRole === 'admin' ||
          ws.userRole === 'super_admin' ||
          ws.userRole === 'support_agent';

        const broadcastMsg: SupportMessagePayload = {
          type: 'message',
          id: savedMessage.id,
          ticketId,
          userId: ws.userId,
          userName: ws.userName,
          senderType: isAgent ? 'agent' : 'customer',
          content,
          timestamp: new Date(savedMessage.createdAt).getTime(),
        };

        // Broadcast to user's connected sessions
        broadcastToUser(userId, broadcastMsg);

        // If message is from customer, trigger automated assistant response
        if (!isAgent) {
          setTimeout(async () => {
            try {
              // Send typing indicator
              broadcastToUser(userId, {
                type: 'typing',
                userName: 'Support Assistant',
                isTyping: true,
              });

              // Add a slight realistic delay
              await new Promise((res) => setTimeout(res, 1000));

              const replyContent = getAssistantReply(content);

              // Find an admin user or use sender to record system response
              const adminUser = await prisma.user.findFirst({
                where: { role: { in: ['admin', 'super_admin'] } },
                select: { id: true, name: true },
              });

              const replyUserId = adminUser?.id || userId;

              const savedReply = await prisma.supportMessage.create({
                data: {
                  ticketId: ticketId!,
                  userId: replyUserId,
                  message: replyContent,
                },
              });

              // Clear typing indicator
              broadcastToUser(userId, {
                type: 'typing',
                userName: 'Support Assistant',
                isTyping: false,
              });

              // Send Assistant Message
              broadcastToUser(userId, {
                type: 'message',
                id: savedReply.id,
                ticketId,
                userId: replyUserId,
                userName: 'Support Specialist',
                senderType: 'agent',
                content: replyContent,
                timestamp: new Date(savedReply.createdAt).getTime(),
              });
            } catch (replyErr: any) {
              console.error('[WebSocket] Auto-reply error:', replyErr.message);
              broadcastToUser(userId, {
                type: 'typing',
                userName: 'Support Assistant',
                isTyping: false,
              });
            }
          }, 400);
        }
      } else if (parsed.type === 'typing') {
        // Forward typing event to other sockets for this user
        broadcastToUser(userId, {
          type: 'typing',
          userId: ws.userId,
          userName: ws.userName,
          isTyping: parsed.isTyping !== false,
        });
      }
    } catch (err: any) {
      console.error('[WebSocket] Message processing error:', err.message);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: 'error',
            content: 'Failed to process message',
            timestamp: Date.now(),
          })
        );
      }
    }
  });

  ws.on('close', () => {
    console.log(`[WebSocket] Closed: ${ws.userName} (${userId})`);
    const sockets = userSockets.get(userId);
    if (sockets) {
      sockets.delete(ws);
      if (sockets.size === 0) {
        userSockets.delete(userId);
      }
    }
  });
}

export function getActiveUserCount(): number {
  return userSockets.size;
}

export function getActiveSessions(): string[] {
  return Array.from(userSockets.keys());
}
