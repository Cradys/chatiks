import { JSONSchema } from "json-schema-to-ts"
import { FastifySchema } from "fastify"
import { CreateMethodType } from "./type_helper.js"

const authBody = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' },
  },
  additionalProperties: false
} as const satisfies JSONSchema

const authRes = {
  200:{
    type: 'object',
    properties: {
      token: { type: 'string' }
    },
    additionalProperties: false
  } 
} as const satisfies Record<any, JSONSchema>

export const authSchema = {
  body: authBody,
  response: authRes
} as const satisfies FastifySchema

export type AuthSchemaType = CreateMethodType<typeof authSchema>