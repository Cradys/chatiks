import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { auth, createUserHandler } from './handlers/auth_handler.js'
import { DTO } from '../models/index.js'
import { config } from '../config.js'

async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/auth', { schema: DTO.authSchema }, auth)

  fastify.post('/api/users', { schema: DTO.createUserSchema, config: { jwt: config.jwt } }, createUserHandler)
}

export default fp(authRoutes, { name: 'authRoutes', dependencies: ['repositoriesPlugin'] })
