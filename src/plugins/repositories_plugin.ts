import fp from 'fastify-plugin'
import { FastifyInstance } from "fastify";
import { UserRepository } from "../db/repositories/users.js";
import { MessageRepository } from '../db/repositories/messages.js';

declare module 'fastify' {
   interface FastifyInstance {
    db: {
      userRepository: UserRepository,
      messageRepository: MessageRepository
    }
   }
}

async function repositoriesPlugin(fastify: FastifyInstance) {

  const userRepository = new UserRepository(fastify.knex)
  const messageRepository = new MessageRepository(fastify.knex)

  fastify.decorate('db', {
    userRepository: userRepository,
    messageRepository: messageRepository
  })
}

export default fp(repositoriesPlugin, {dependencies: ['knexPlugin']})