import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const query = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      created_at: { type: 'string' },
      // updated_at: { type: ['string', 'null'] },
      text: { type: 'string' },
      sender_id: { type: 'string' }
    },
    required: ['id', 'text', 'created_at'],
    additionalProperties: false
  } 
} as const satisfies Record<any, JSONSchema>

export const sseChatsSchema = {
  querystring: query,
  response: res
} as const satisfies FastifySchema

export type SSEChatsType = DTOTypeHelper<typeof sseChatsSchema>
