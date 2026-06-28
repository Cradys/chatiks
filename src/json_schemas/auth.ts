import { FromSchema, JSONSchema } from "json-schema-to-ts"
import { FastifyReply } from "fastify/types/reply.js"
import { FastifySchema, RouteHandler } from "fastify"

const authBody: JSONSchema = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  }
} as const

const authRes: JSONSchema = {
  type: 'object',
  properties: {
    response: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
} as const


const authSchema: FastifySchema = {
  body: authBody,
  response: authRes
} as const

export type AuthSchema = FromSchema<typeof authSchema>w