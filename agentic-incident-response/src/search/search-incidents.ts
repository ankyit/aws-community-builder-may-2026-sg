import { OS_SETUP_HINT, REQUEST_TIMEOUT_MS } from '../config.js'
import { log } from '../logger.js'
import type { SearchResult } from '../types.js'
import { withTimeout } from '../withTimeout.js'
import { osClient } from '../opensearch/client.js'
import { INCIDENTS_INDEX } from '../opensearch/constants.js'
import { isOpenSearchConnectionError } from '../opensearch/isOpenSearchConnectionError.js'
import { buildSearchBody } from './buildSearchBody.js'
import { hitsToSearchResults, type OsHit } from './hitsToSearchResults.js'

export async function searchSimilarIncidents(
  description: string,
  category?: string,
  limit = 5,
  alarmName?: string,
): Promise<SearchResult[]> {
  try {
    const body = buildSearchBody(description, category, limit, alarmName)
    const res = await withTimeout(
      osClient.search({ index: INCIDENTS_INDEX, body }),
      REQUEST_TIMEOUT_MS,
      'OpenSearch search',
    )
    const rawHits = res.body?.hits?.hits
    if (!Array.isArray(rawHits)) {
      log.warn('OpenSearch search returned unexpected response shape')
      return []
    }
    return hitsToSearchResults(rawHits as OsHit[])
  } catch (error: unknown) {
    if (isOpenSearchConnectionError(error)) {
      log.error(OS_SETUP_HINT)
      return []
    }
    const msg = error instanceof Error ? error.message : String(error)
    log.error(`searchSimilarIncidents failed while querying OpenSearch: ${msg}`)
    return []
  }
}
