import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const body = {
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['direct', 'group', 'channel'] },
    user_ids: { 
      type: 'array',
      items: {
        type: 'string'
      },
      minItems: 2
    },
  },
  required: ['type', 'user_ids'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200:{
    type: 'object',
    properties: {
      id: { type: 'string' }
    },
    required: ['id'],
    additionalProperties: false
  } 
} as const satisfies Record<any, JSONSchema>

export const createChatSchema = {
  body: body,
  response: res
} as const satisfies FastifySchema

export type CreateChatType = DTOTypeHelper<typeof createChatSchema>
