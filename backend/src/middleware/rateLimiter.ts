import rateLimit from 'express-rate-limit';

const windowMinutes = parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10);
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);

// Global rate limiter applied to all /api routes
export const globalLimiter = rateLimit({
  windowMs: windowMinutes * 60 * 1000, 
  limit: maxRequests, 
  standardHeaders: true, 
  legacyHeaders: false, 
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
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  } ,

});
  