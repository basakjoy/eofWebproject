/**
 * Normalize the API base URL so callers can use either:
 * - http://localhost:5000
 * - http://localhost:5000/api
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const base = raw.replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}
