import http from 'k6/http';
import { check, sleep } from 'k6';

// Baseline/Load Testing Configuration
// 100 virtual users running continuously for 1 minute
export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    // We expect 95% of requests to complete within 250ms
    http_req_duration: ['p(95)<250'],
    // We expect a 0% failure rate
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Simulate hitting the backend API
  const res = http.get('http://localhost:5000/api/health');
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time is acceptable': (r) => r.timings.duration < 1500, // Max 1500ms
  });

  // Small sleep to simulate realistic user behavior between requests
  sleep(1);
}
