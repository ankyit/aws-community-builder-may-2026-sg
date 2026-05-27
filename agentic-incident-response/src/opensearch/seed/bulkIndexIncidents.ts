import { log } from '../../logger.js'
import type { IncidentDoc } from '../../types.js'
import { osClient } from '../client.js'
import { INCIDENTS_INDEX } from '../constants.js'

export async function bulkIndexIncidents(docs: IncidentDoc[]): Promise<void> {
  const body: Record<string, unknown>[] = []
  let id = 1
  for (const doc of docs) {
    body.push({ index: { _index: INCIDENTS_INDEX, _id: String(id++) } })
    body.push(doc as unknown as Record<string, unknown>)
  }
  const res = await osClient.bulk({ refresh: true, body })
  if (res.body.errors) {
    const first = res.body.items?.find((i: { index?: { error?: unknown } }) => i.index?.error)
    log.error(`Bulk indexing errors: ${JSON.stringify(first)}`)
    throw new Error('Bulk indexing reported errors')
  }
  log.info(`Indexed ${docs.length} incidents into "${INCIDENTS_INDEX}".`)
}
