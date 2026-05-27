import { DescribeAlarmsCommand } from '@aws-sdk/client-cloudwatch'
import { REQUEST_TIMEOUT_MS, AWS_CREDENTIALS_HINT } from '../config.js'
import { log } from '../logger.js'
import type { IncidentDoc } from '../types.js'
import { withTimeout } from '../withTimeout.js'
import { alarmToIncidentDoc } from './alarmToIncidentDoc.js'
import { cwClient } from './client.js'

function isCredentialsError(err: unknown): boolean {
  return err instanceof Error && (err.name === 'CredentialsProviderError' || err.name === 'CredentialError')
}

function isAccessDenied(err: unknown): boolean {
  return err instanceof Error && err.name === 'AccessDeniedException'
}

export async function fetchActiveAlarms(): Promise<IncidentDoc[]> {
  try {
    const out: IncidentDoc[] = []
    let nextToken: string | undefined
    do {
      const response = await withTimeout(
        cwClient.send(
          new DescribeAlarmsCommand({
            StateValue: 'ALARM',
            MaxRecords: 100,
            NextToken: nextToken,
          }),
        ),
        REQUEST_TIMEOUT_MS,
        'CloudWatch DescribeAlarms',
      )
      for (const a of response.MetricAlarms ?? []) {
        out.push(alarmToIncidentDoc(a))
      }
      nextToken = response.NextToken
    } while (nextToken)
    return out
  } catch (error: unknown) {
    if (isCredentialsError(error)) {
      log.error(AWS_CREDENTIALS_HINT)
      return []
    }
    if (isAccessDenied(error)) {
      log.error('Missing permission: cloudwatch:DescribeAlarms')
      return []
    }
    const msg = error instanceof Error ? error.message : String(error)
    log.error(`fetchActiveAlarms failed while calling CloudWatch: ${msg}`)
    return []
  }
}
