import { FastifyRequest, FastifyReply, RouteHandler } from "fastify";
import type { AuthSchemaType } from "./json_schemas/auth.js";


export async function auth(req: FastifyRequest<AuthSchemaType>, reply: FastifyReply<AuthSchemaType>) {
  console.log(req.body)
  reply.code(200).send({token: 'bob'})
}

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  
}
