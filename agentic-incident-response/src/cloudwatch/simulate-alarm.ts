import { DescribeAlarmsCommand, SetAlarmStateCommand } from '@aws-sdk/client-cloudwatch'
import { log } from '../logger.js'
import { cwClient } from './client.js'

const SCENARIO_MAP = {
  cpu: {
    name: 'ECS-WebApp-HighCPU',
    reason: 'CPU utilization exceeded 90% on Monday morning',
  },
  latency: {
    name: 'APIGateway-HighLatency',
    reason: 'API p99 latency exceeded 2000ms around midnight',
  },
  database: {
    name: 'RDS-ConnectionCount-High',
    reason: 'Database connections exceeded 95% threshold',
  },
} as const

const VALID_KEYS = Object.keys(SCENARIO_MAP) as (keyof typeof SCENARIO_MAP)[]

function isValidScenario(arg: string): arg is keyof typeof SCENARIO_MAP {
  return VALID_KEYS.includes(arg as keyof typeof SCENARIO_MAP)
}

async function alarmExists(name: string): Promise<boolean> {
  const res = await cwClient.send(new DescribeAlarmsCommand({ AlarmNames: [name] }))
  return (res.MetricAlarms?.length ?? 0) > 0
}

async function main(): Promise<void> {
  const raw = (process.argv[2] ?? 'cpu').toLowerCase()
  if (!isValidScenario(raw)) {
    log.error(`Invalid scenario "${process.argv[2]}". Use: cpu | latency | database`)
    process.exit(1)
  }
  const entry = SCENARIO_MAP[raw]
  if (!(await alarmExists(entry.name))) {
    log.error(
      `Alarm "${entry.name}" does not exist. Run ./run.sh create-alarms (or npm run create-alarms) first.`,
    )
    process.exit(1)
  }
  await cwClient.send(
    new SetAlarmStateCommand({
      AlarmName: entry.name,
      StateValue: 'ALARM',
      StateReason: entry.reason,
    }),
  )
  log.result(`Alarm "${entry.name}" set to ALARM (${raw}).`)
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
