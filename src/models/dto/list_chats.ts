import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const query = {
  type: 'object',
  properties: {
    user_id: { type: 'string' },
    type: { type: 'string', enum: ['direct', 'group'] },
    limit: { type: 'integer', default: 30, minimum: 1, maximum: 100 },
    offset: { type: 'integer', default: 0, minimum: 1, maximum: 100 }
  },
  required: ['user_id'],
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
        type: { type: 'string', enum: ['direct', 'group', 'channel'] },
      },
      required: ['id', 'type', 'created_at'],
      additionalProperties: false
    }
  } 
} as const satisfies Record<any, JSONSchema>

export const listChatsSchema = {
  querystring: query,
  response: res
} as const satisfies FastifySchema

export type ListChatsType = DTOTypeHelper<typeof listChatsSchema>
