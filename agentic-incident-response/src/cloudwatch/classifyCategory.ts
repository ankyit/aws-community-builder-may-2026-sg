import type { MetricAlarm } from '@aws-sdk/client-cloudwatch'

export function classifyCategory(alarm: MetricAlarm): string {
  const metric = (alarm.MetricName ?? '').toLowerCase()
  if (metric.includes('cpu')) return 'cpu'
  if (metric.includes('memory') || metric.includes('mem')) return 'memory'
  if (metric.includes('latency') || metric.includes('duration')) return 'latency'
  if (metric.includes('error') || metric.includes('5xx') || metric.includes('4xx')) return 'errors'
  if (metric.includes('disk')) return 'disk'
  if (metric.includes('connection')) return 'database'
  if (metric.includes('throttle')) return 'serverless'
  return 'other'
}
