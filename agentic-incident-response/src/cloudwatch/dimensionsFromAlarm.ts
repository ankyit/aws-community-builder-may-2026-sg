import type { MetricAlarm } from '@aws-sdk/client-cloudwatch'

export function dimensionsFromAlarm(alarm: MetricAlarm): Record<string, string> {
  const out: Record<string, string> = {}
  for (const d of alarm.Dimensions ?? []) {
    if (d.Name && d.Value) out[d.Name] = d.Value
  }
  return out
}
