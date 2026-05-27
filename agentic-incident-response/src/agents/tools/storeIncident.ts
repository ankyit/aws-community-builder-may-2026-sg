import { tool } from '@strands-agents/sdk'
import { z } from 'zod'
import { REQUEST_TIMEOUT_MS } from '../../config.js'
import { log } from '../../logger.js'
import { withTimeout } from '../../withTimeout.js'
import { osClient } from '../../opensearch/client.js'
import { INCIDENTS_INDEX } from '../../opensearch/constants.js'
import { isOpenSearchConnectionError } from '../../opensearch/isOpenSearchConnectionError.js'

export const storeIncident = tool({
  name: 'store_incident',
  description: 'Store a resolved incident in OpenSearch agentic memory for future learning.',
  inputSchema: z.object({
    alarm_name: z.string(),
    description: z.string(),
    severity: z.enum(['critical', 'high', 'medium', 'low']).describe('Severity level'),
    category: z
      .enum([
        'cpu',
        'latency',
        'database',
        'memory',
        'errors',
        'disk',
        'certificate',
        'container',
        'serverless',
        'queue',
        'network',
        'other',
      ])
      .describe('Incident category'),
    root_cause: z.string(),
    resolution: z.string(),
    auto_resolved: z.boolean(),
    tags: z.string().describe('Comma-separated tags'),
  }),
  callback: async (input) => {
    try {
      const { tags: tagStr, ...rest } = input
      const doc = {
        ...rest,
        state: 'RESOLVED',
        timestamp: new Date().toISOString(),
        resolved_at: new Date().toISOString(),
        metric_name: 'agent-recorded',
        namespace: 'Agent/Memory',
        service: 'agentic-incident-response',
        dimensions: {},
        resolution_time_minutes: 0,
        tags: tagStr.split(',').map((t: string) => t.trim()).filter(Boolean),
      }
      await withTimeout(
        osClient.index({ index: INCIDENTS_INDEX, body: doc, refresh: true }),
        REQUEST_TIMEOUT_MS,
        'OpenSearch index document',
      )
      return JSON.stringify({ status: 'stored', alarm_name: input.alarm_name })
    } catch (error: unknown) {
      if (isOpenSearchConnectionError(error)) {
        log.error('OpenSearch is not running. Run ./run.sh setup first.')
        return JSON.stringify({ status: 'error', message: 'OpenSearch unavailable' })
      }
      const msg = error instanceof Error ? error.message : String(error)
      log.error(`store_incident failed: ${msg}`)
      return JSON.stringify({ status: 'error', message: msg })
    }
  },
})
