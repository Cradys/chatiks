import fp from 'fastify-plugin'
import { FastifyInstance } from "fastify";
import { UserRepository } from "../db/repositories/users.js";

declare module 'fastify' {
   interface FastifyInstance {
    db: {
      userRepository: UserRepository
    }
   }
}

async function repositoriesPlugin(fastify: FastifyInstance) {
  
  const userRepository = new UserRepository(fastify.knex)

  fastify.decorate('db', {
    userRepository: userRepository
  })
}

export default fp(repositoriesPlugin)