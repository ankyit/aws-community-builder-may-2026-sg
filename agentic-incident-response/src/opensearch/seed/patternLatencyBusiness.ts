import type { IncidentDoc } from '../../types.js'
import { DAY_MS } from './dates.js'

export function patternLatencyBusinessDoc(): IncidentDoc {
  const biz = new Date(Date.now() - 11 * DAY_MS)
  biz.setUTCHours(3, 0, 0, 0)
  return {
    alarm_name: 'APIGateway-HighLatency',
    description: 'API Gateway p99 latency exceeded 2000ms during business hours checkout.',
    state: 'resolved',
    severity: 'critical',
    category: 'latency',
    timestamp: biz.toISOString(),
    resolved_at: new Date(biz.getTime() + 90 * 60 * 1000).toISOString(),
    metric_name: 'Latency',
    namespace: 'AWS/ApiGateway',
    service: 'production-api',
    dimensions: { ApiName: 'production-api', Stage: 'prod' },
    root_cause: 'Third-party payment provider API downtime',
    resolution: 'Enabled circuit breaker. Contacted provider.',
    resolution_time_minutes: 90,
    auto_resolved: false,
    tags: ['third-party', 'payment', 'escalated'],
  }
}
