import { tool } from '@strands-agents/sdk'
import { z } from 'zod'
import { fetchActiveAlarms } from '../../cloudwatch/fetchActiveAlarms.js'

export const checkCloudwatchAlarms = tool({
  name: 'check_cloudwatch_alarms',
  description: 'Check CloudWatch for any currently active alarms in the AWS account.',
  inputSchema: z.object({}),
  callback: async () => {
    const alarms = await fetchActiveAlarms()
    if (alarms.length === 0) {
      return 'No active alarms.'
    }
    const slim = alarms.map((a) => ({
      alarm_name: a.alarm_name,
      category: a.category,
      severity: a.severity,
      service: a.service,
      description: a.description.slice(0, 120),
    }))
    return JSON.stringify({ count: slim.length, alarms: slim })
  },
})
