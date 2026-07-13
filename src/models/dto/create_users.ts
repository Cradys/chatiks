import { FastifySchema } from "fastify";
import { JSONSchema } from "json-schema-to-ts"
import { DTOTypeHelper } from "../helpers/index.js";

const reqBody = {
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


const response = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    name: { type: ['string', 'null'] },
    created_at: { type: 'string' }
  },
  additionalProperties: false
} as const satisfies JSONSchema

export const createUserSchema = {
  body: reqBody,
  response: response
} as const satisfies FastifySchema

export type CreateUserType = DTOTypeHelper<typeof createUserSchema>;