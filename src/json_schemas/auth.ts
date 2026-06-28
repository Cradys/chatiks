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
} as const as JSONSchema

const authRes = {
  200:{
    type: 'object',
    properties: {
      token: { type: 'string' }
    } 
  } 
} as const satisfies Record<any, JSONSchema>

const authSchema = {
  body: authBody,
  querystring: authBody,
  params: authBody,
  headers: authBody,
  response: authRes
} as const satisfies FastifySchema

export type AuthSchema = CreateMethodType<typeof authSchema>