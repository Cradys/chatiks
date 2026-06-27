import { FromSchema } from "json-schema-to-ts"

const authBodySchema = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false
} as const

const schema = {
  body: authBodySchema
} as const

const authReplySchema = {
  type: 'object',
  properties: {
    hello: { type: 'string' }
  },
  additionalProperties: false
} as const

export type AuthBody = FromSchema<typeof authBodySchema>;
export type AuthRepl = FromSchema<typeof authReplySchema>;