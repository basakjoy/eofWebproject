import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

const parsedWindow = Number.parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10);
const parsedMax = Number.parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
const windowMinutes = Number.isFinite(parsedWindow) && parsedWindow > 0 ? parsedWindow : 15;
const maxRequests = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 100;
const redisClient = process.env.REDIS_URL ? createClient({ url: process.env.REDIS_URL }) : undefined;

redisClient?.on('error', () => console.error('Rate-limit Redis connection error'));

export const connectRateLimitStore = async () => {
  if (redisClient && !redisClient.isOpen) await redisClient.connect();
};

export const closeRateLimitStore = async () => {
  if (redisClient?.isOpen) await redisClient.quit();
};

export const createSharedRateLimitStore = (prefix: string) => redisClient
  ? new RedisStore({
      prefix,
      sendCommand: (...args: string[]) => redisClient.sendCommand(args as [string, ...string[]]),
    })
  : undefined;

// Global rate limiter applied to all /api routes
export const globalLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000, 
  limit: maxRequests, 
  standardHeaders: true, 
  legacyHeaders: false, 
  store: createSharedRateLimitStore('rl:global:'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});

// Stricter rate limiter for authentication routes (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
  store: createSharedRateLimitStore('rl:auth:'),
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  store: createSharedRateLimitStore('rl:api:'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  } ,

});

export const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  store: createSharedRateLimitStore('rl:review:'),
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  } ,

});
  