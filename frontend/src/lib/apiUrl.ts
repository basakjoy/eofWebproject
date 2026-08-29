/**
 * Normalize the API base URL so callers can use either:
 * - http://localhost:5000
 * - http://localhost:5000/api
 */
export function getApiBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').trim();
  const base = raw.replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

export function getWebSocketUrl(): string {
  const configured = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const apiUrl = new URL(getApiBaseUrl());
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = `${apiUrl.pathname.replace(/\/api\/?$/, '')}/ws/support`;
  apiUrl.search = '';
  return apiUrl.toString().replace(/\/$/, '');
}
