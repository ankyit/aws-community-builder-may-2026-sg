import { Agent, tool } from '@strands-agents/sdk'
import { z } from 'zod'
import { model } from './agents/model.js'
import { fetchActiveAlarms } from './cloudwatch/fetchActiveAlarms.js'

const checkAlarms = tool({
  name: 'check_alarms',
  description: 'Check CloudWatch for active alarms.',
  inputSchema: z.object({}),
  callback: async () => {
    const alarms = await fetchActiveAlarms()
    if (alarms.length === 0) return 'No active alarms found.'
    return JSON.stringify({ count: alarms.length, alarms })
  },
})

const agent = new Agent({
  model,
  systemPrompt: 'You are a monitoring agent. Check for alarms and report what you find.',
  tools: [checkAlarms],
})

async function main() {
  console.log('Testing single agent with CloudWatch tool...')
  try {
    const result = await agent.invoke('Check CloudWatch for any active alarms.')
    console.log('Result:', result.toString())
  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : error)
    console.error('Full:', error)
  }
}

main()
