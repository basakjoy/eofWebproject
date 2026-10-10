import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.API_URL || 'http://localhost:5000').replace(/\/$/, '');
const accessToken = __ENV.K6_TOKEN;

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '60s', target: 50 },
    { duration: '120s', target: 100 },
    { duration: '60s', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<750', 'p(99)<1500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.99'],
  },
};

export function setup() {
  if (!accessToken) {
    throw new Error('Set K6_TOKEN to a valid access token for a test account');
  }
}

export default function () {
  const response = http.get(`${baseUrl}/api/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    tags: { endpoint: 'authenticated-profile' },
  });

  check(response, {
    'profile responds 200': (result) => result.status === 200,
    'profile response is successful': (result) => {
      try {
        return result.json('success') === true;
      } catch {
        return false;
      }
    },
  });

  sleep(0.2);
}
