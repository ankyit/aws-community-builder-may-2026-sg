import type { MetricAlarm } from '@aws-sdk/client-cloudwatch'
import type { IncidentDoc } from '../types.js'
import { classifyCategory } from './classifyCategory.js'
import { classifySeverity } from './classifySeverity.js'
import { dimensionsFromAlarm } from './dimensionsFromAlarm.js'
import { extractService } from './extractService.js'

export function alarmToIncidentDoc(alarm: MetricAlarm): IncidentDoc {
  const now = new Date().toISOString()
  return {
    alarm_name: alarm.AlarmName ?? 'unknown',
    description:
      alarm.AlarmDescription ??
      `${alarm.MetricName ?? 'metric'} in ${alarm.Namespace ?? 'namespace'} is in ALARM`,
    state: alarm.StateValue ?? 'ALARM',
    severity: classifySeverity(alarm),
    category: classifyCategory(alarm),
    timestamp: now,
    resolved_at: now,
    metric_name: alarm.MetricName ?? '',
    namespace: alarm.Namespace ?? '',
    service: extractService(alarm),
    dimensions: dimensionsFromAlarm(alarm),
    root_cause: '',
    resolution: '',
    resolution_time_minutes: 0,
    auto_resolved: false,
    tags: ['cloudwatch', 'active-alarm'],
  }
}
