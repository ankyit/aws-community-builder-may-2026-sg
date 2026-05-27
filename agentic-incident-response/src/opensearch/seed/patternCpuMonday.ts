import type { IncidentDoc } from '../../types.js'
import { mondayWeeksAgo } from './dates.js'

const RESOLUTION_MINUTES = [25, 28, 30, 32] as const

export function patternCpuMondayDocs(): IncidentDoc[] {
  return [1, 2, 3, 4].map((weeksBack, i) => {
    const ts = mondayWeeksAgo(weeksBack)
    const mins = RESOLUTION_MINUTES[i] ?? 30
    return {
      alarm_name: 'ECS-WebApp-HighCPU',
      description:
        'CPU utilization exceeded 90% on ECS service web-app-production on Monday morning during weekly report batch.',
      state: 'resolved',
      severity: 'medium',
      category: 'cpu',
      timestamp: ts,
      resolved_at: new Date(new Date(ts).getTime() + mins * 60 * 1000).toISOString(),
      metric_name: 'CPUUtilization',
      namespace: 'AWS/ECS',
      service: 'web-app-production',
      dimensions: { ServiceName: 'web-app-production', ClusterName: 'prod-cluster' },
      root_cause: 'Monday morning batch job processing weekly reports',
      resolution: 'No action needed. Batch job completes within 30 minutes.',
      resolution_time_minutes: mins,
      auto_resolved: true,
      tags: ['batch-job', 'recurring', 'monday', 'auto-suppressed'],
    }
  })
}
