import { Agent } from '@strands-agents/sdk'
import { model } from './agents/model.js'

const agent = new Agent({
  model,
  systemPrompt: 'You are a helpful assistant. Keep responses short.',
})

async function main() {
  console.log('Testing Bedrock connection...')
  try {
    const result = await agent.invoke('Say hello in one sentence.')
    console.log('Response:', result.toString())
  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : error)
    console.error('Full error:', error)
  }
}

main()
