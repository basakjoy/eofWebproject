import { Request, Response } from 'express';
import { message, resolveLocale } from './messages';

export const getRequestLocale = (req: Request) => resolveLocale(req.header('X-Locale') || req.query.locale as string | undefined);

export const localizedMessage = (req: Request, key: string) => message(key, getRequestLocale(req));

export const sendLocalizedError = (req: Request, res: Response, status: number, key: string) =>
  res.status(status).json({ success: false, message: localizedMessage(req, key) });