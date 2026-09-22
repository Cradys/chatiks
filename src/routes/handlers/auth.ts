import { type FastifyRequest, type FastifyReply, type RouteHandler } from "fastify";
import type { DTO } from "../../models/index.js";
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'
import * as argon2 from "argon2"
import { type Config } from "../../config.js";

type AuthRouteConfig = {
  jwt: Config['jwt']
}

export async function auth(req: FastifyRequest<DTO.CreateUserType>, reply: FastifyReply<DTO.CreateUserType, any, any, any, AuthRouteConfig>) {
  const config = reply.routeOptions.config  
  const user = await req.server.db.userRepository.getUserByLogin(req.body.login)
  
  if (!user) {
    throw Error('login or password not valid')
  }
  
  const token = await makeJWT(user.id, config.jwt.secret, config.jwt.issuer, config.jwt.expiresIn, user.id)
  reply.code(200).send({token: token})
}


export async function createUserHandler(req: FastifyRequest<DTO.CreateUserType>, reply: FastifyReply<DTO.CreateUserType, any, any, any, AuthRouteConfig>) {
  //make specified error code
  //now http 500, to be 475
  if (await req.server.db.userRepository.getUserByLogin(req.body.login)) {
    throw Error('login or password not valid')
  }
  const config = reply.routeOptions.config


  const hash = await argon2.hash(req.body.password, {
    type: argon2.argon2d
  })
  const user = await req.server.db.userRepository.create({login: req.body.login, password: hash})
  
  const token = await makeJWT(user.id, config.jwt.secret, config.jwt.issuer, config.jwt.expiresIn, user.id)

  reply
    .code(200)
    .send({token: token})
}


async function makeJWT(userID: string, secret: string, issuer: string, expiresIn: number, user_id: string) {
  // current time in seconds
  const nowDate = Math.floor(Date.now() / 1000)

  let payload: JwtPayload | { user_id: string } = {
    iss: issuer,
    sub: userID,
    iat: nowDate,
    exp: nowDate + expiresIn,
    user_id: user_id
  }
  
  const token = jwt.sign(payload, secret)
  return token
} 
