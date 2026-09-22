import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const params = {
  type: 'object',
  properties: {
    id: { type: 'string' },
  },
  required: ['id'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200:{
    type: 'object',
    properties: {
      id: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: ['string', 'null'] },
      type: { type: 'string', enum: ['direct', 'group', 'channel'] },
      user_ids: { 
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    required: ['id', 'type', 'user_ids'],
    additionalProperties: false 
  } 
} as const satisfies Record<any, JSONSchema>

export const getChatSchema = {
  params: params,
  response: res
} as const satisfies FastifySchema

export type GetChatType = DTOTypeHelper<typeof getChatSchema>
