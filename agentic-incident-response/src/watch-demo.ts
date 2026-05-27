import { DescribeAlarmsCommand } from '@aws-sdk/client-cloudwatch'
import { cwClient } from './cloudwatch/client.js'
import { log } from './logger.js'
import { orchestrator } from './agents/index.js'
import { BEDROCK_ACCESS_HINT } from './config.js'

const POLL_INTERVAL_MS = 10_000
const PROMPT =
  'Check for any active CloudWatch alarms and handle them through the full incident response loop. For each alarm: detect it, investigate similar past incidents, and decide the appropriate response.'

let lastAlarmState = 'OK'

async function checkAlarms(): Promise<string> {
  const res = await cwClient.send(
    new DescribeAlarmsCommand({ StateValue: 'ALARM', MaxRecords: 10 }),
  )
  const count = res.MetricAlarms?.length ?? 0
  return count > 0 ? 'ALARM' : 'OK'
}

function isLikelyBedrockAccessDenied(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return (
    msg.includes('AccessDenied') ||
    msg.includes('access denied') ||
    msg.includes('not authorized') ||
    msg.includes('Invocation of model')
  )
}

async function runAgent(): Promise<void> {
  try {
    log.step('ALARM DETECTED - triggering incident response agent...')
    const result = await orchestrator.invoke(PROMPT)
    log.info(result.toString())
    log.result('Incident response complete. Resuming watch...')
  } catch (error: unknown) {
    if (isLikelyBedrockAccessDenied(error)) {
      log.error(BEDROCK_ACCESS_HINT)
    } else {
      log.error(`Agent failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

async function poll(): Promise<void> {
  try {
    const state = await checkAlarms()
    if (state === 'ALARM' && lastAlarmState !== 'ALARM') {
      lastAlarmState = 'ALARM'
      await runAgent()
    } else if (state === 'OK' && lastAlarmState === 'ALARM') {
      lastAlarmState = 'OK'
      log.info('All alarms cleared. Watching...')
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    if (msg.includes('CredentialsProvider') || msg.includes('CredentialError')) {
      log.error('AWS credentials not found. Run aws configure first.')
      process.exit(1)
    }
    log.warn(`Poll error: ${msg}`)
  }
}

async function main(): Promise<void> {
  log.step('Incident Response Watcher started')
  log.info(`Polling CloudWatch every ${POLL_INTERVAL_MS / 1000}s for ALARM state...`)
  log.info('Push a metric to trigger: aws cloudwatch put-metric-data --namespace Demo/IncidentResponse --metric-name DemoCPU --value 95')
  log.info('Press Ctrl+C to stop')
  log.info('')

  await poll()
  setInterval(poll, POLL_INTERVAL_MS)
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
