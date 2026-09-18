import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { DTO } from "../models/index.js"
import { createMessage, listMessages } from './handlers/messages_handler.js'


async function messages(fastify: FastifyInstance) {
  fastify.post('/api/messages', {schema: DTO.createMessageSchema}, createMessage)
  fastify.get('/api/messages', {schema: DTO.listMessagesSchema}, listMessages)
}

export default fp(messages, {name: "messagesRoutes", dependencies: ['repositoriesPlugin'] })