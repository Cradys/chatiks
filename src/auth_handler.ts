import { FastifyRequest, FastifyReply } from "fastify";


export async function auth(req: FastifyRequest, reply: FastifyReply) {
  console.log(req.body)
  reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({ hello: 'World!!'})
  return reply
}

export async function createUser(req: FastifyRequest, reply: FastifyReply) {
  
}