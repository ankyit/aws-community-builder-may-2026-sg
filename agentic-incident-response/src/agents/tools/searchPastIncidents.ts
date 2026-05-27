import { tool } from '@strands-agents/sdk'
import { z } from 'zod'
import { searchSimilarIncidents } from '../../search/search-incidents.js'

export const searchPastIncidents = tool({
  name: 'search_past_incidents',
  description:
    'Search OpenSearch for similar past incidents based on description and optional category and alarm_name.',
  inputSchema: z.object({
    description: z.string().describe('Description of the current incident'),
    category: z.string().optional().describe('Category: cpu, latency, database, memory, errors, etc.'),
    alarm_name: z.string().optional().describe('Exact CloudWatch alarm name, e.g. ECS-WebApp-HighCPU'),
  }),
  callback: async ({ description, category, alarm_name }) => {
    const results = await searchSimilarIncidents(description, category, 5, alarm_name)
    const slim = results.map((r) => ({
      alarm_name: r.alarm_name,
      category: r.category,
      auto_resolved: r.auto_resolved,
      root_cause: r.root_cause.slice(0, 80),
      resolution: r.resolution.slice(0, 80),
    }))
    return JSON.stringify({
      matches_found: slim.length,
      incidents: slim,
    })
  },
})
