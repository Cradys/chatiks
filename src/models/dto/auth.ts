import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { DTOTypeHelper } from "../helpers/index.js";

const body = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' },
  },
  required: ['login', 'password'],
  additionalProperties: false
} as const satisfies JSONSchema

const res = {
  200:{
    type: 'object',
    properties: {
      token: { type: 'string' },
      id: { type: 'string' }
    },
    required: ['token', 'id'],
    additionalProperties: false
  }
} as const satisfies Record<any, JSONSchema>

export const authSchema = {
  body: body,
  response: res
} as const satisfies FastifySchema

export type AuthType = DTOTypeHelper<typeof authSchema>
