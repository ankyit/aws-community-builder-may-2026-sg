import type { IncidentDoc } from '../../types.js'
import { midnightDaysAgo } from './dates.js'

export function patternLatencyMidnightDocs(): IncidentDoc[] {
  return [5, 12, 19].map((daysAgo, idx) => {
    const ts = midnightDaysAgo(daysAgo, 5 + idx * 10)
    return {
      alarm_name: 'APIGateway-HighLatency',
      description: 'API Gateway p99 latency exceeded 2000ms around midnight after CDN cache expiry.',
      state: 'resolved',
      severity: 'medium',
      category: 'latency',
      timestamp: ts,
      resolved_at: new Date(new Date(ts).getTime() + 15 * 60 * 1000).toISOString(),
      metric_name: 'Latency',
      namespace: 'AWS/ApiGateway',
      service: 'production-api',
      dimensions: { ApiName: 'production-api', Stage: 'prod' },
      root_cause: 'CloudFront cache TTL expired at midnight. Cold cache hitting origin.',
      resolution: 'Auto-resolves in 15 minutes after cache warms up.',
      resolution_time_minutes: 15,
      auto_resolved: true,
      tags: ['cdn', 'cache-expiry', 'midnight', 'recurring'],
    }
  })
}
