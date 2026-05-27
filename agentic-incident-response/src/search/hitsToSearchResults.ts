import type { SearchResult } from '../types.js'

export type OsHit = {
  _id: string
  _score?: number
  _source?: {
    alarm_name?: string
    description?: string
    category?: string
    severity?: string
    root_cause?: string
    resolution?: string
    auto_resolved?: boolean
    resolution_time_minutes?: number
    timestamp?: string
    tags?: string[]
  }
}

export function hitsToSearchResults(hits: OsHit[]): SearchResult[] {
  return hits.map((h) => {
    const s = h._source
    return {
      id: h._id,
      score: h._score ?? 0,
      alarm_name: s?.alarm_name ?? '',
      description: s?.description ?? '',
      category: s?.category ?? '',
      severity: s?.severity ?? '',
      root_cause: s?.root_cause ?? '',
      resolution: s?.resolution ?? '',
      resolution_time_minutes: s?.resolution_time_minutes,
      auto_resolved: s?.auto_resolved ?? false,
      timestamp: s?.timestamp ?? '',
      tags: s?.tags ?? [],
    }
  })
}
