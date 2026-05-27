import { fetchActiveAlarms } from './cloudwatch/fetchActiveAlarms.js'
import { log } from './logger.js'
import { searchSimilarIncidents } from './search/search-incidents.js'

async function main(): Promise<void> {
  try {
    const alarms = await fetchActiveAlarms()
    log.step(`Active ALARM count: ${alarms.length}`)
    log.info(JSON.stringify(alarms, null, 2))
    for (const a of alarms) {
      log.step(`Similar incidents for ${a.alarm_name}`)
      const desc = `${a.description} (${a.metric_name} ${a.namespace})`
      const matches = await searchSimilarIncidents(desc, a.category, 8)
      log.info(JSON.stringify(matches, null, 2))
    }
  } catch (err) {
    log.error(`test-cloudwatch failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
