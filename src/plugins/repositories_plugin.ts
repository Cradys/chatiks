import fp from 'fastify-plugin'
import { FastifyInstance } from "fastify";
import { ChatRepository, UserRepository, MessageRepository } from '../repositories/index.js'

declare module 'fastify' {
   interface FastifyInstance {
    db: {
      userRepository: UserRepository,
      messageRepository: MessageRepository,
      chatRepository: ChatRepository
    }
   }
}

async function repositoriesPlugin(fastify: FastifyInstance) {

  const userRepository = new UserRepository(fastify.knex)
  const chatRepository = new ChatRepository(fastify.knex)
  const messageRepository = new MessageRepository(fastify.knex)

  fastify.decorate('db', {
    userRepository: userRepository,
    messageRepository: messageRepository,
    chatRepository: chatRepository
  })
}

export default fp(repositoriesPlugin, {dependencies: ['knexPlugin']})