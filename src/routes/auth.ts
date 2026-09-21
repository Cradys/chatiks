import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { auth, createUserHandler } from './handlers/auth.js'
import { DTO } from '../models/index.js'
import { config } from '../config.js'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/api/login', { schema: DTO.authSchema, config: { jwt: config.jwt } }, auth)

  fastify.post('/api/users', { schema: DTO.createUserSchema, config: { jwt: config.jwt } }, createUserHandler)
}

export default fp(authRoutes, { name: 'authRoutes', dependencies: ['repositoriesPlugin'] })
