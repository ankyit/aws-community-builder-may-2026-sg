import { PutMetricAlarmCommand } from '@aws-sdk/client-cloudwatch'
import { log } from '../logger.js'
import { cwClient } from './client.js'

async function main(): Promise<void> {
  try {
    const alarms = [
      new PutMetricAlarmCommand({
        AlarmName: 'ECS-WebApp-HighCPU',
        AlarmDescription: 'Demo: ECS CPU utilization high for web-app-production',
        MetricName: 'CPUUtilization',
        Namespace: 'AWS/ECS',
        Statistic: 'Average',
        Period: 300,
        EvaluationPeriods: 1,
        Threshold: 90,
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [
          { Name: 'ClusterName', Value: 'prod-cluster' },
          { Name: 'ServiceName', Value: 'web-app-production' },
        ],
        TreatMissingData: 'notBreaching',
      }),
      new PutMetricAlarmCommand({
        AlarmName: 'APIGateway-HighLatency',
        AlarmDescription: 'Demo: API Gateway p99 latency high',
        MetricName: 'Latency',
        Namespace: 'AWS/ApiGateway',
        ExtendedStatistic: 'p99',
        Period: 300,
        EvaluationPeriods: 1,
        Threshold: 2000,
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [
          { Name: 'ApiName', Value: 'production-api' },
          { Name: 'Stage', Value: 'prod' },
        ],
        TreatMissingData: 'notBreaching',
      }),
      new PutMetricAlarmCommand({
        AlarmName: 'RDS-ConnectionCount-High',
        AlarmDescription: 'Demo: RDS database connections high',
        MetricName: 'DatabaseConnections',
        Namespace: 'AWS/RDS',
        Statistic: 'Average',
        Period: 300,
        EvaluationPeriods: 1,
        Threshold: 160,
        ComparisonOperator: 'GreaterThanThreshold',
        Dimensions: [{ Name: 'DBInstanceIdentifier', Value: 'prod-db-primary' }],
        TreatMissingData: 'notBreaching',
      }),
    ]
    for (const cmd of alarms) {
      await cwClient.send(cmd)
      log.info(`Created or updated alarm: ${cmd.input?.AlarmName ?? 'unknown'}`)
    }
    log.result('CloudWatch demo alarms ready.')
  } catch (err) {
    log.error(`create-alarms failed: ${err instanceof Error ? err.message : String(err)}`)
    process.exit(1)
  }
}

main().catch((err) => {
  log.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
