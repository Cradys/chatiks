import { FastifyRequest, FastifyReply } from "fastify";
import type { AuthBody, AuthRepl } from "./json_schemas/create_users.js";
import authReqJSON from '../json_schemas/auth_req.json' with {type: 'json'}
import { FromSchema } from "json-schema-to-ts";

export const authReqSchema = authReqJSON as const;

type Req = FromSchema<typeof authSchema>

export async function auth(req: FastifyRequest<{Body:AuthBody}>, reply: FastifyReply<{Reply: AuthRepl}>) {
  console.log(req.body)
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'World!!'})
}

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  
}