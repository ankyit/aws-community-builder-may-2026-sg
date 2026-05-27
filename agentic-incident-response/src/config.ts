import dotenv from 'dotenv'

dotenv.config()

const region = process.env.AWS_DEFAULT_REGION ?? process.env.AWS_REGION ?? 'ap-southeast-1'

export const BEDROCK_MODEL_ACCESS_URL =
  'https://console.aws.amazon.com/bedrock/home?region=ap-southeast-1#/modelaccess'

export const OS_SETUP_HINT = 'OpenSearch is not running. Run ./run.sh setup first.'

export const AWS_CREDENTIALS_HINT = 'AWS credentials not found. Run aws configure first.'

export const BEDROCK_ACCESS_HINT = `Bedrock model access denied. Enable Nova 2 Lite at ${BEDROCK_MODEL_ACCESS_URL}`

export const REQUEST_TIMEOUT_MS = 60_000

export const config = {
  OPENSEARCH_HOST: process.env.OPENSEARCH_HOST ?? 'localhost',
  OPENSEARCH_PORT: Number(process.env.OPENSEARCH_PORT ?? '9200'),
  OPENSEARCH_USERNAME: process.env.OPENSEARCH_USERNAME ?? 'admin',
  OPENSEARCH_PASSWORD: process.env.OPENSEARCH_PASSWORD ?? 'Demo@Strong1Pass',
  OPENSEARCH_SSL: (process.env.OPENSEARCH_SSL ?? 'true').toLowerCase() !== 'false',
  AWS_REGION: region,
  BEDROCK_REGION: process.env.BEDROCK_REGION ?? region,
  BEDROCK_MODEL_ID: process.env.BEDROCK_MODEL_ID ?? 'us.anthropic.claude-sonnet-4-20250514-v1:0',
} as const
