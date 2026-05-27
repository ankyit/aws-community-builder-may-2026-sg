import { Agent } from '@strands-agents/sdk'
import { leanModel } from './model.js'
import { checkCloudwatchAlarms } from './tools.js'

export const detective = new Agent({
  model: leanModel,
  systemPrompt: `You are a Detective Agent for infrastructure incident response.
Your job:
1. Check CloudWatch for active alarms
2. For each alarm, classify its severity and provide a clear description
3. Report what you found in a structured way
Be concise and factual.
Do not use emoji, special unicode characters, or markdown formatting in your responses. Use plain text only.`,
  tools: [checkCloudwatchAlarms],
  printer: false,
})
