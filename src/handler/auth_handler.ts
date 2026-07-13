import { type FastifyRequest, type FastifyReply, fastify } from "fastify";
import type { DTO } from "../models/index.js";
import { config } from "../config.js";
import { UserRepository } from "../db/repositories/users.js";
import * as argon2 from "argon2"

//look for make it part of req.server.knex
// maybe like plugin
import knex from '../db.js';


export async function auth(req: FastifyRequest<DTO.AuthType>, reply: FastifyReply<DTO.AuthType>) {

  console.log(req.body)
  reply.code(200).send({token: 'bob'})
}


export async function createUserHandler(req: FastifyRequest<DTO.CreateUserType>, reply: FastifyReply<DTO.CreateUserType>) {
  const hash = await argon2.hash(req.body.password, {
    type: argon2.argon2id,
    secret: Buffer.from(config.secret)
  })

  //make like plugin. Connect UserRepository to fastify plugins
  const userRepository = new UserRepository(knex)
  
  //const user = await userRepository.createUser({login: req.body.login, password: hash})
  reply
    .code(200)
    .send({
      login: 'bob',
      name: null,
      created_at: Date()
    })
}
