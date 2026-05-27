import { log } from '../logger.js'
import { buildAllIncidentDocs } from './seed/buildAllDocs.js'
import { bulkIndexIncidents } from './seed/bulkIndexIncidents.js'

async function main(): Promise<void> {
  try {
    const docs = buildAllIncidentDocs()
    await bulkIndexIncidents(docs)
  } catch (err) {
    log.error(`seed-incidents failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
