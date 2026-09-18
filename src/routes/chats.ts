import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { DTO } from "../models/index.js"
import { createChat, getChat, listChats} from './handlers/chats_handler.js'

async function chats(fastify: FastifyInstance,) {
  fastify.get('/api/chats/:id', {schema: DTO.getChatSchema}, getChat)
  fastify.get('/api/chats', {schema: DTO.listChatsSchema}, listChats)
  fastify.post('/api/chats', {schema: DTO.createChatSchema}, createChat)
}

export default fp(chats, { name: 'chatsRoutes', dependencies: ['repositoriesPlugin'] })