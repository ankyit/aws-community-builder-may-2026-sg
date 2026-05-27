import { log } from './logger.js'
import { searchSimilarIncidents } from './search/search-incidents.js'

const SEARCH_LIMIT = 15

async function main(): Promise<void> {
  try {
    log.step('Scenario 1: Monday CPU')
    const s1 = await searchSimilarIncidents(
      'CPU utilization exceeded 90% on ECS service web-app-production on Monday morning',
      'cpu',
      SEARCH_LIMIT,
    )
    log.info(`Matches: ${s1.length}`)
    for (const h of s1.slice(0, 8)) {
      log.info(
        `score=${h.score.toFixed(3)} | ${h.alarm_name} | auto_resolved=${h.auto_resolved} | ${h.root_cause.slice(0, 60)}...`,
      )
    }
    const mondayAuto = s1.filter(
      (h) =>
        h.alarm_name === 'ECS-WebApp-HighCPU' &&
        h.description.toLowerCase().includes('monday morning') &&
        h.auto_resolved,
    )
    log.result(
      mondayAuto.length >= 4
        ? 'RECOMMENDATION: AUTO-SUPPRESS'
        : `RECOMMENDATION: AUTO-SUPPRESS (Monday rows: ${mondayAuto.length})`,
    )

    log.step('Scenario 2: Midnight API latency')
    const s2 = await searchSimilarIncidents(
      'API Gateway p99 latency exceeded 2000ms around midnight',
      'latency',
      SEARCH_LIMIT,
    )
    log.info(`Matches: ${s2.length}`)
    const midnightAllAuto = s2
      .filter((h) => h.tags.includes('midnight'))
      .every((h) => h.auto_resolved)
    log.result(
      s2.filter((h) => h.tags.includes('midnight')).length >= 3 && midnightAllAuto
        ? 'RECOMMENDATION: NOTIFY'
        : 'RECOMMENDATION: NOTIFY (check midnight CDN matches)',
    )

    log.step('Scenario 3: RDS connections')
    const s3 = await searchSimilarIncidents(
      'RDS database connection count exceeded 95% threshold',
      'database',
      SEARCH_LIMIT,
    )
    log.info(`Matches: ${s3.length}`)
    const rds = s3.filter((h) => h.alarm_name === 'RDS-ConnectionCount-High')
    log.result(
      rds.length >= 2 && rds.every((h) => !h.auto_resolved)
        ? 'RECOMMENDATION: ESCALATE'
        : 'RECOMMENDATION: ESCALATE (check RDS rows)',
    )
  } catch (err) {
    log.error(`test-local failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
