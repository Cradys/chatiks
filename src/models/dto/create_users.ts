import { FastifySchema } from "fastify";
import { JSONSchema } from "json-schema-to-ts"
import { DTOTypeHelper } from "../helpers/index.js";

const body = {
  type: 'object',
  properties: {
    login: { type: 'string', maxLength: 128},
    password: { 
      type: 'string', 
      pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])', 
      maxLength: 32, 
      minLength: 8
    }
  },
  required: ['login', 'password'],
  additionalProperties: false
} as const satisfies JSONSchema


const res = {
  200:{
    type: 'object',
    properties: {
      token: { type: 'string' }
    },
    required: ['token'],
    additionalProperties: false
  }
} as const satisfies Record<any, JSONSchema> 

export const createUserSchema = {
  body: body,
  response: res
} as const satisfies FastifySchema

export type CreateUserType = DTOTypeHelper<typeof createUserSchema>;