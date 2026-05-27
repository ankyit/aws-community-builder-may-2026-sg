import { SEARCH_SOURCE_FIELDS } from './searchSourceFields.js'

export function buildSearchBody(
  description: string,
  category: string | undefined,
  limit: number,
  alarmName?: string,
) {
  const must: Record<string, unknown>[] = [
    {
      match: {
        description: {
          query: description,
          fuzziness: 'AUTO',
        },
      },
    },
  ]
  if (category) {
    must.push({ term: { category } })
  }

  const should: Record<string, unknown>[] = [
    { match: { root_cause: { query: description, boost: 1.5 } } },
    { match: { resolution: { query: description, boost: 1.2 } } },
    { match: { alarm_name: { query: description, boost: 2 } } },
  ]
  if (alarmName) {
    should.push({ term: { 'alarm_name.raw': alarmName } })
    should.push({ match: { alarm_name: { query: alarmName, boost: 3 } } })
  }

  return {
    _source: [...SEARCH_SOURCE_FIELDS],
    size: limit,
    query: {
      bool: {
        must,
        should,
        minimum_should_match: 0,
      },
    },
    sort: [{ _score: 'desc' as const }, { timestamp: 'desc' as const }],
  }
}
