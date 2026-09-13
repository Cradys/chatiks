import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const body = {
  type: 'object',
  properties: {
    chat_id: { type: 'string' },
    text: { type: 'string', minLength: 1 },
    sender_id: { type: 'string' }
  },
  required: ['chat_id', 'text', 'sender_id'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
    additionalProperties: false
  } 
} as const satisfies Record<any, JSONSchema>

export const createMessageSchema = {
  body: body,
  response: res
} as const satisfies FastifySchema

export type CreateMessageType = DTOTypeHelper<typeof createMessageSchema>
