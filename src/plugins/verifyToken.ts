import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'
import jwt from 'jsonwebtoken'
import { type Config } from "../config.js";


declare module 'fastify' {
  interface FastifyInstance {
    verifyToken: (rawToken: string | undefined) => Promise<jwt.JwtPayload & {user_id: string}>
  }
}

async function verifyToken(fastify: FastifyInstance, opts: Config['jwt']) {
  fastify.decorate('verifyToken', verifyToken)

  async function verifyToken(rawToken: string | undefined): Promise<jwt.JwtPayload & {user_id: string}> {
    try{ 
      if (!rawToken) {
        throw new Error('authorization header not found')
      }
      const token = rawToken.slice(7).trim()
      const decode = jwt.verify(token, opts.secret, {issuer: opts.issuer, clockTimestamp: Math.floor(Date.now() / 1000)})
      if (typeof decode === 'string') {
        throw new Error('invalid token payload')
      }
      if (typeof decode.user_id !== 'string') {
        throw new Error('invalid token payload')
      }
      return decode as jwt.JwtPayload & { user_id: string }
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }
}

export default fp(verifyToken, {name: 'verifyToken'})