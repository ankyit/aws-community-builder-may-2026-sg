import { CloudWatchClient } from '@aws-sdk/client-cloudwatch'
import { config } from '../config.js'

export const cwClient = new CloudWatchClient({ region: config.AWS_REGION })
