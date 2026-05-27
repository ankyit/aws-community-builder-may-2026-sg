import { Client } from '@opensearch-project/opensearch'
import { config } from '../config.js'

const protocol = config.OPENSEARCH_SSL ? 'https' : 'http'

export const osClient = new Client({
  node: `${protocol}://${config.OPENSEARCH_HOST}:${config.OPENSEARCH_PORT}`,
  auth: {
    username: config.OPENSEARCH_USERNAME,
    password: config.OPENSEARCH_PASSWORD,
  },
  ssl: {
    // Local dev only. Use proper certs in production.
    rejectUnauthorized: false,
  },
})
