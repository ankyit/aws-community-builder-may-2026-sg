import type { MetricAlarm } from '@aws-sdk/client-cloudwatch'
import type { SeverityLevel } from '../types.js'

export function classifySeverity(alarm: MetricAlarm): SeverityLevel {
  const name = (alarm.AlarmName ?? '').toLowerCase()
  if (name.includes('critical') || name.includes('fatal') || name.includes('emergency')) {
    return 'critical'
  }
  if (name.includes('high') || name.includes('error') || name.includes('5xx')) return 'high'
  return 'medium'
}
