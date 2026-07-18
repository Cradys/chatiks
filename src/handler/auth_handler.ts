import { type FastifyRequest, type FastifyReply } from "fastify";
import type { DTO } from "../models/index.js";
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import * as argon2 from "argon2"

type AuthRouteConfig = {
  jwt: {
    secret: string;
    expiresIn: number;
    issuer: string;
  };
  pass_secret: string
}

export async function auth(req: FastifyRequest<DTO.AuthType>, reply: FastifyReply<DTO.AuthType>) {

  console.log(req.body)
  reply.code(200).send({token: 'bob'})
}


export async function createUserHandler(req: FastifyRequest<DTO.CreateUserType>, reply: FastifyReply<DTO.CreateUserType, any, any, any, AuthRouteConfig>) {
  //make specified error code
  //now http 500, to be 475
  if (await req.server.db.userRepository.isUserExistByLogin(req.body.login)) {
    throw Error('login or password not valid')
  }

  const config = reply.routeOptions.config


  const hash = await argon2.hash(req.body.password, {
    type: argon2.argon2id,
    secret: Buffer.from(config.pass_secret)
  })
  
  const user = await req.server.db.userRepository.createUser({login: req.body.login, password: hash})
  
  const token = await makeJWT(user.id, config.jwt.secret, config.jwt.issuer, config.jwt.expiresIn)

  reply
    .code(200)
    .send({token: token})
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

async function makeJWT(userID: string, secret: string, issuer: string, expiresIn: number) {
  // current time in seconds
  const nowDate = Math.floor(Date.now() / 1000)

  let payload: payload = {
    iss: issuer,
    sub: userID,
    iat: nowDate,
    exp: nowDate + expiresIn
  }
  
  const token = jwt.sign(payload, secret)
  return token
} 
