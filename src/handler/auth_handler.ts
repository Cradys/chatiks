import { type FastifyRequest, type FastifyReply } from "fastify";
import type { DTO } from "../models/index.js";
import { config } from "../config.js";
import * as argon2 from "argon2"



export async function auth(req: FastifyRequest<DTO.AuthType>, reply: FastifyReply<DTO.AuthType>) {

  console.log(req.body)
  reply.code(200).send({token: 'bob'})
}


export async function createUserHandler(req: FastifyRequest<DTO.CreateUserType>, reply: FastifyReply<DTO.CreateUserType>) {
  const hash = await argon2.hash(req.body.password, {
    type: argon2.argon2id,
    secret: Buffer.from(config.secret)
  })
  
  const user = await req.server.db.userRepository.createUser({login: req.body.login, password: hash})
  
  reply
    .code(200)
    .send(user)
}
