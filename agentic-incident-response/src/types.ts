export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'

export interface IncidentDoc {
  alarm_name: string
  description: string
  state: string
  severity: SeverityLevel
  category: string
  timestamp: string
  resolved_at?: string
  metric_name: string
  namespace: string
  service: string
  dimensions: Record<string, string>
  root_cause: string
  resolution: string
  resolution_time_minutes?: number
  auto_resolved: boolean
  tags: string[]
}

export interface SearchResult {
  id: string
  score: number
  alarm_name: string
  description: string
  category: string
  severity: string
  root_cause: string
  resolution: string
  resolution_time_minutes?: number
  auto_resolved: boolean
  timestamp: string
  tags: string[]
}
