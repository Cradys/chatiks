import { FastifySchema } from "fastify";
import { JSONSchema } from "json-schema-to-ts"
import { DTOTypeHelper } from "../helpers/index.js";

const reqBody = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies JSONSchema


const response = {
  200:{
    type: 'object',
    properties: {
      login: { type: 'string' },
      name: { type: ['string', 'null'] },
      created_at: { type: 'string' }
    },
    additionalProperties: false
  }
} as const satisfies Record<any, JSONSchema> 

export const createUserSchema = {
  body: reqBody,
  response: response
} as const satisfies FastifySchema

export type CreateUserType = DTOTypeHelper<typeof createUserSchema>;