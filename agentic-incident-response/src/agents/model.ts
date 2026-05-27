import { BedrockModel } from '@strands-agents/sdk'
import { config } from '../config.js'

export const model = new BedrockModel({
  modelId: config.BEDROCK_MODEL_ID,
  region: config.BEDROCK_REGION,
  maxTokens: 4096,
})

export const leanModel = new BedrockModel({
  modelId: config.BEDROCK_MODEL_ID,
  region: config.BEDROCK_REGION,
  maxTokens: 1024,
})
