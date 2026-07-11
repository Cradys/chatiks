import type { FastifyRequest, FastifyReply } from "fastify";
import type { AuthType, CreateUserType } from "../models/dto/index.js";
import knex from '../db.js';


export async function auth(req: FastifyRequest<AuthType>, reply: FastifyReply<AuthType>) {

  console.log(req.body)
  reply.code(200).send({token: 'bob'})
}

//DB interface

interface User {
  id: string,
  created_at?: string,
  updated_at?: string,
  login: string,
  name?: string,
  password: string,
  phone_number?:string
}

export async function createUser(req: FastifyRequest<CreateUserType>, reply: FastifyReply<CreateUserType>) {
  const users = await knex<User>('users').insert(req.body, '*')
  const createdUser: User = users[0]
  console.log(users)
  reply
    .code(200)
    .send(createdUser)
}
