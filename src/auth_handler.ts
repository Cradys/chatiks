import { FastifyRequest, FastifyReply, RouteHandler } from "fastify";
import type { AuthSchemaType } from "./json_schemas/auth.js";
import type { CreateUserType } from "./json_schemas/create_users.js";
import knex from './db.js';
import { UUID } from "crypto";


export async function auth(req: FastifyRequest<AuthSchemaType>, reply: FastifyReply<AuthSchemaType>) {

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
