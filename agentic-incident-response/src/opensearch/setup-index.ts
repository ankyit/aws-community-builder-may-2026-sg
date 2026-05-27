import { log } from '../logger.js'
import { osClient } from './client.js'
import { INCIDENTS_INDEX } from './constants.js'

const MAPPINGS_PROPERTIES = {
  alarm_name: {
    type: 'text',
    fields: { raw: { type: 'keyword' } },
  },
  description: { type: 'text' },
  state: { type: 'keyword' },
  severity: { type: 'keyword' },
  category: { type: 'keyword' },
  timestamp: { type: 'date' },
  resolved_at: { type: 'date' },
  metric_name: { type: 'keyword' },
  namespace: { type: 'keyword' },
  service: { type: 'keyword' },
  dimensions: { type: 'object', enabled: true },
  root_cause: { type: 'text' },
  resolution: { type: 'text' },
  resolution_time_minutes: { type: 'integer' },
  auto_resolved: { type: 'boolean' },
  tags: { type: 'keyword' },
} as const

async function main(): Promise<void> {
  try {
    const exists = await osClient.indices.exists({ index: INCIDENTS_INDEX })
    if (exists.body) {
      await osClient.indices.delete({ index: INCIDENTS_INDEX })
      log.info(`Deleted existing index "${INCIDENTS_INDEX}".`)
    }
    await osClient.indices.create({
      index: INCIDENTS_INDEX,
      body: { mappings: { properties: MAPPINGS_PROPERTIES } },
    })
    log.info(`Created index "${INCIDENTS_INDEX}" with mappings.`)
  } catch (err) {
    log.error(`setup-index failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
