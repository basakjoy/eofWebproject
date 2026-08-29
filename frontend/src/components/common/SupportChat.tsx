'use client';

import { useState, useEffect, useRef } from 'react';
import { useWebSocketSupport, SupportChatMessage } from '@/hooks/useWebSocketSupport';
import { useAuthStore } from '@/store/authStore';
import {
  Send,
  X,
  MessageSquare,
  Headphones,
  Bot,
  RefreshCw,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_ACTIONS = [
  { label: '💰 Deposit Help', prompt: 'How do I make a deposit into my account?' },
  { label: '📊 Signals Guide', prompt: 'How do I access and follow your trading signals?' },
  { label: '💳 Withdrawal Process', prompt: 'How long do withdrawals take to process?' },
  { label: '🛡️ Verification (KYC)', prompt: 'What documents are required for account verification?' },
];

export default function SupportChat({ isOpen, onClose }: SupportChatProps) {
  const { user, token } = useAuthStore();
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    isConnected,
    isConnecting,
    messages,
    isTyping,
    typingUser,
    ticketId,
    sendMessage,
    sendTypingIndicator,
    reconnect,
  } = useWebSocketSupport();

  // Auto-scroll to bottom when new messages arrive or typing status changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // If user is not authenticated, do not render
  if (!user || !token) {
    return null;
  }

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();

    const text = customText || messageInput;
    if (!text.trim() || !isConnected) return;

    const success = sendMessage(text);
    if (success && !customText) {
      setMessageInput('');
      sendTypingIndicator(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);

    if (isConnected) {
      sendTypingIndicator(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false);
      }, 1500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="fixed bottom-20 right-4 sm:right-6 w-[24rem] max-w-[calc(100vw-2rem)] h-[34rem] bg-[#0c0e17]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 flex flex-col z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#181a29] via-[#141726] to-[#0c0e17] border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <div className="w-full h-full bg-[#0d0f1a] rounded-[11px] flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0c0e17] ${
                    isConnected
                      ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50'
                      : isConnecting
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-semibold text-sm tracking-wide">Client Support</h3>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    <Zap className="w-2.5 h-2.5" /> 24/7 Live
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  {isConnected ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Agent Online
                    </span>
                  ) : isConnecting ? (
                    <span className="text-amber-400">Connecting to server...</span>
                  ) : (
                    <span className="text-zinc-500 flex items-center gap-1">
                      Disconnected
                      <button
                        onClick={reconnect}
                        className="text-indigo-400 hover:text-indigo-300 underline font-medium ml-1 inline-flex items-center gap-0.5"
                      >
                        <RefreshCw className="w-2.5 h-2.5" /> Retry
                      </button>
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Ticket banner */}
          {ticketId && (
            <div className="px-4 py-1.5 bg-indigo-950/40 border-b border-indigo-500/10 flex items-center justify-between text-[11px] text-indigo-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Session ID: <span className="font-mono text-zinc-300">{ticketId.slice(0, 8)}...</span>
              </span>
              <span className="text-[10px] text-indigo-400/80 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                Verified Client
              </span>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
            {/* Welcome banner if empty */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-white text-sm font-medium">How can we help today?</h4>
                <p className="text-zinc-400 text-xs mt-1 max-w-[240px]">
                  Our client support specialist is ready to help you with signals, deposits, or trading inquiries.
                </p>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 gap-1.5 w-full mt-4">
                  {QUICK_ACTIONS.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(undefined, action.prompt)}
                      disabled={!isConnected}
                      className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <span>{action.label}</span>
                      <Sparkles className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message List */}
            {messages.map((msg, idx) => {
              const isCustomer = msg.senderType === 'customer' || msg.userId === user?.id;

              return (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${isCustomer ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-end gap-2 max-w-[85%]">
                    {!isCustomer && (
                      <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mb-1">
                        <Bot className="w-3.5 h-3.5 text-indigo-300" />
                      </div>
                    )}

                    <div
                      className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                        isCustomer
                          ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-xs font-normal'
                          : 'bg-[#181b29] text-zinc-200 border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      {!isCustomer && (
                        <p className="text-[10px] font-semibold text-indigo-400 mb-1">
                          {msg.userName || 'Support Specialist'}
                        </p>
                      )}
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>

                  <span className="text-[10px] text-zinc-500 mt-1 px-1 font-mono">
                    {msg.timestamp
                      ? new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </span>
                </motion.div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 max-w-[80%]"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-indigo-300" />
                </div>
                <div className="px-3.5 py-2 rounded-2xl bg-[#181b29] border border-white/10 rounded-bl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-zinc-400 ml-1">
                    {typingUser || 'Support Assistant'} is typing...
                  </span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions when messages exist */}
          {messages.length > 0 && messages.length < 5 && (
            <div className="px-4 py-1.5 bg-[#090b12] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_ACTIONS.slice(0, 2).map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(undefined, action.prompt)}
                  disabled={!isConnected}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-zinc-400 hover:text-zinc-200 border border-white/5 transition-colors disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-[#0d0f1a] border-t border-white/10">
            <form onSubmit={(e) => handleSendMessage(e)} className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={isConnected ? 'Type your message...' : 'Connecting to support...'}
                disabled={!isConnected}
                className="flex-1 px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="submit"
                disabled={!isConnected || !messageInput.trim()}
                className="p-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shrink-0"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
