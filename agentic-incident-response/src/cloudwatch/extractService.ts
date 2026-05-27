import type { MetricAlarm } from '@aws-sdk/client-cloudwatch'

export function extractService(alarm: MetricAlarm): string {
  const dims = alarm.Dimensions ?? []
  for (const d of dims) {
    if (
      d.Name === 'ServiceName' ||
      d.Name === 'FunctionName' ||
      d.Name === 'DBInstanceIdentifier' ||
      d.Name === 'LoadBalancer' ||
      d.Name === 'ApiName'
    ) {
      return d.Value ?? alarm.AlarmName ?? 'unknown'
    }
  }
  return alarm.AlarmName ?? 'unknown'
}
