import type { IncidentDoc } from '../../types.js'
import { DAY_MS } from './dates.js'

export function patternRdsDocs(): IncidentDoc[] {
  const r1 = new Date(Date.now() - 6 * DAY_MS)
  r1.setUTCHours(4, 0, 0, 0)
  const r2 = new Date(Date.now() - 16 * DAY_MS)
  r2.setUTCHours(9, 15, 0, 0)
  return [
    {
      alarm_name: 'RDS-ConnectionCount-High',
      description: 'RDS connection count exceeded threshold on primary instance.',
      state: 'resolved',
      severity: 'high',
      category: 'database',
      timestamp: r1.toISOString(),
      resolved_at: new Date(r1.getTime() + 50 * 60 * 1000).toISOString(),
      metric_name: 'DatabaseConnections',
      namespace: 'AWS/RDS',
      service: 'prod-db-primary',
      dimensions: { DBInstanceIdentifier: 'prod-db-primary' },
      root_cause: 'Connection leak in authentication microservice',
      resolution: 'Patched service; recycled connections.',
      resolution_time_minutes: 50,
      auto_resolved: false,
      tags: ['connection-leak', 'escalated'],
    },
    {
      alarm_name: 'RDS-ConnectionCount-High',
      description: 'RDS connections spiked after deployment.',
      state: 'resolved',
      severity: 'high',
      category: 'database',
      timestamp: r2.toISOString(),
      resolved_at: new Date(r2.getTime() + 40 * 60 * 1000).toISOString(),
      metric_name: 'DatabaseConnections',
      namespace: 'AWS/RDS',
      service: 'prod-db-primary',
      dimensions: { DBInstanceIdentifier: 'prod-db-primary' },
      root_cause: 'New deployment with misconfigured connection pool',
      resolution: 'Rolled back deployment; fixed pool sizing.',
      resolution_time_minutes: 40,
      auto_resolved: false,
      tags: ['deployment', 'misconfiguration', 'rollback'],
    },
  ]
}
