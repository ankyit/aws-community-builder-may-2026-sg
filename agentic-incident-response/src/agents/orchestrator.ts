import { Agent, tool } from '@strands-agents/sdk'
import { z } from 'zod'
import { model } from './model.js'
import { detective } from './detective.js'
import { investigator } from './investigator.js'
import { responder } from './responder.js'

const detectiveAgentTool = tool({
  name: 'detective_agent',
  description: 'Checks CloudWatch for active alarms and classifies them.',
  inputSchema: z.object({
    task: z.string().describe('Instructions for the detective.'),
  }),
  callback: async (input) => {
    const result = await detective.invoke(input.task)
    return result.toString() || 'No active alarms found.'
  },
})

const investigatorAgentTool = tool({
  name: 'investigator_agent',
  description:
    'Searches OpenSearch for similar past incidents. Pass the exact alarm_name and description from the detective.',
  inputSchema: z.object({
    task: z.string(),
    alarm_name: z.string().optional().describe('The exact alarm name from CloudWatch, e.g. ECS-WebApp-HighCPU'),
    category: z.string().optional(),
  }),
  callback: async (input) => {
    const parts = [input.task]
    if (input.alarm_name) parts.push(`The alarm name is: ${input.alarm_name}`)
    if (input.category) parts.push(`Search category: ${input.category}`)
    const result = await investigator.invoke(parts.join('\n'))
    return result.toString() || 'No similar incidents found in history.'
  },
})

const responderAgentTool = tool({
  name: 'responder_agent',
  description: 'Decides response action and stores incident in memory.',
  inputSchema: z.object({
    task: z.string(),
  }),
  callback: async (input) => {
    const result = await responder.invoke(input.task)
    return result.toString() || 'Incident noted. No action taken.'
  },
})

export const orchestrator = new Agent({
  model,
  systemPrompt: `You are the Incident Commander orchestrating the full incident response loop.
When triggered, follow this sequence:
1. DETECT: Ask the detective to check CloudWatch for active alarms
2. INVESTIGATE: For each alarm, ask the investigator to search for similar past incidents
3. RESPOND: Ask the responder to decide the action based on investigation
4. REPORT: Provide a final summary of all incidents handled and decisions made
Be systematic. Handle each alarm one at a time through the full loop.
When calling investigator_agent, pass the exact alarm_name from CloudWatch (e.g. ECS-WebApp-HighCPU) together with the task so search can match seeded incidents.
Do not use emoji, special unicode characters, or markdown formatting in your responses. Use plain text only.
Keep your final report under 200 words. No decorative formatting.`,
  tools: [detectiveAgentTool, investigatorAgentTool, responderAgentTool],
  printer: false,
})
