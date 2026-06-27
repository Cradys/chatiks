import { FastifyRequest, FastifyReply } from "fastify";
import type { AuthBody, AuthRepl } from "./json_schemas/create_users.js";


export async function auth(req: FastifyRequest<{Body: AuthBody}>, reply: FastifyReply<{Reply: AuthRepl}>) {
  console.log(req.body)
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'World!!'})
}

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  
}