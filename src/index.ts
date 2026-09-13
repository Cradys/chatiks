import Fastify from 'fastify'
import { config } from './config.js'
import { auth, createUserHandler } from './handler/auth_handler.js'
import { createChat, getChat, listChats} from './handler/chats_handler.js'
import { createMessage } from './handler/messages_handler.js'
import { DTO } from "./models/index.js"
import { knexPlugin, repositoriesPlugin, eventEmmiterPlugin } from './plugins/index.js'
import { test_sse } from './handler/sse_test_handler.js'
import { fastifySSE } from '@fastify/sse'

//TODO 
// start using nodemon
// create custom Error handler with custom errors

export const fastify = Fastify({
  logger: true
})

await fastify.register(knexPlugin)
await fastify.register(repositoriesPlugin)
await fastify.register(eventEmmiterPlugin)
await fastify.register(fastifySSE)


fastify.post('/auth', {schema: DTO.authSchema}, auth)


fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

// fastify.post('/api/login', schemas.auth , auth)
fastify.post('/api/users', {schema: DTO.createUserSchema, config: {jwt: config.jwt}}, createUserHandler)


fastify.get('/api/chats/:id', {schema: DTO.getChatSchema}, getChat)
fastify.get('/api/chats', {schema: DTO.listChatsSchema}, listChats)
fastify.post('/api/chats', {schema: DTO.createChatSchema}, createChat)

fastify.post('/api/messages', {schema: DTO.createMessageSchema}, createMessage)


fastify.get('/sse/:chat_id', {sse: 'only'}, test_sse)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}