import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const query = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['direct', 'group'] },
    limit: { type: 'string' },
    offset: { type: 'string' }
  },
  required: [],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200:{
    type: 'array',
    items: {
      type: 'object',
      properties: {
        chat_id: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        type: { type: 'string', enum: ['direct', 'group'] },
      },
      required: ['chat_id', 'type'],
      additionalProperties: false
    }
  } 
} as const satisfies Record<any, JSONSchema>

export const listChatsSchema = {
  querystring: query,
  response: res
} as const satisfies FastifySchema

export type ListChatsType = DTOTypeHelper<typeof listChatsSchema>
