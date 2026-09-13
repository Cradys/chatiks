import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const query = {
  type: 'object',
  properties: {
    chat_id: { type: 'string' },
    limit: { type: 'integer', default: 30, minimum: 1, maximum: 100 },
    offset: { type: 'integer', default: 0, minimum: 1, maximum: 100 }
  },
  required: ['chat_id'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: ['string', 'null'] },
        text: { type: 'string' },
        sender_id: { type: 'string' }
      },
      required: ['id', 'text', 'created_at'],
      additionalProperties: false
    }
  } 
} as const satisfies Record<any, JSONSchema>

export const listMessagesSchema = {
  querystring: query,
  response: res
} as const satisfies FastifySchema

export type ListMessagesType = DTOTypeHelper<typeof listMessagesSchema>
