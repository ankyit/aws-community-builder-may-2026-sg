import type { IncidentDoc } from '../../types.js'
import { wednesdayAfternoon } from './dates.js'

export function patternCpuWednesdayDoc(): IncidentDoc {
  const p3ts = wednesdayAfternoon(10)
  return {
    alarm_name: 'ECS-WebApp-HighCPU',
    description: 'Unexpected CPU spike on ECS service web-app-production on a Wednesday afternoon.',
    state: 'resolved',
    severity: 'high',
    category: 'cpu',
    timestamp: p3ts,
    resolved_at: new Date(new Date(p3ts).getTime() + 75 * 60 * 1000).toISOString(),
    metric_name: 'CPUUtilization',
    namespace: 'AWS/ECS',
    service: 'web-app-production',
    dimensions: { ServiceName: 'web-app-production', ClusterName: 'prod-cluster' },
    root_cause: 'Runaway database query caused by missing index on users table',
    resolution: 'Added composite index. Restarted ECS tasks.',
    resolution_time_minutes: 75,
    auto_resolved: false,
    tags: ['database', 'missing-index', 'unexpected', 'escalated'],
  }
}
