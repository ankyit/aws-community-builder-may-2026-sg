import { BEDROCK_ACCESS_HINT } from './config.js'
import { orchestrator } from './agents/index.js'
import { log } from './logger.js'

const PROMPT =
  'Check for any active CloudWatch alarms and handle them through the full incident response loop. For each alarm: detect it, investigate similar past incidents, and decide the appropriate response.'

function isLikelyBedrockAccessDenied(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return (
    msg.includes('AccessDenied') ||
    msg.includes('access denied') ||
    msg.includes('not authorized') ||
    msg.includes('Invocation of model')
  )
}

async function main(): Promise<void> {
  try {
    const result = await orchestrator.invoke(PROMPT)
    log.info(result.toString())
  } catch (error: unknown) {
    if (isLikelyBedrockAccessDenied(error)) {
      log.error(BEDROCK_ACCESS_HINT)
    } else {
      log.error(`Demo failed: ${error instanceof Error ? error.message : String(error)}`)
    }
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
