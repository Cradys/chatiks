import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { FastifySchema } from "fastify";

type RequiredFastifySchema = {
  [K in keyof FastifySchema]: K extends 'response' ? Record<string, JSONSchema>: JSONSchema 
}

export type CreateMethodType<T extends RequiredFastifySchema> = {
  Body: T['body'] extends JSONSchema? FromSchema<T['body']>: unknown
  Querystring: T['querystring'] extends JSONSchema? FromSchema<T['querystring']>: unknown
  Params: T['params'] extends JSONSchema? FromSchema<T['params']>: unknown
  Headers: T['headers'] extends JSONSchema? FromSchema<T['headers']>: unknown
  // TODO with http code and without http code, but errors with http codes
  // check https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#error-handling
  Reply: T['response'] extends object 
    ? {[Status in keyof T['response']]: T['response'][Status] extends JSONSchema ? FromSchema<T['response'][Status]> : unknown} 
    : unknown
} 