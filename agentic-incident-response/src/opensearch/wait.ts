import { REQUEST_TIMEOUT_MS } from '../config.js'
import { log } from '../logger.js'
import { withTimeout } from '../withTimeout.js'
import { osClient } from './client.js'

const MAX_WAIT_MS = 120_000
const INITIAL_DELAY_MS = 1000
const MAX_DELAY_MS = 16_000

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function main(): Promise<void> {
  const started = Date.now()
  let delayMs = INITIAL_DELAY_MS
  while (Date.now() - started < MAX_WAIT_MS) {
    try {
      await withTimeout(osClient.info(), REQUEST_TIMEOUT_MS, 'OpenSearch cluster info')
      log.info('OpenSearch 3.5 ready.')
      return
    } catch {
      log.info('Waiting...')
    }
    await sleep(delayMs)
    delayMs = Math.min(MAX_DELAY_MS, delayMs * 2)
  }
  throw new Error('OpenSearch did not become ready within 120 seconds')
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
