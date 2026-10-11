import Fastify from 'fastify'
import { config } from './config.js'
import { knexPlugin, repositoriesPlugin, eventEmmiterPlugin, verifyToken } from './plugins/index.js'
import { fastifySSE } from '@fastify/sse'
import { authRoutes, chatsRoutes, messagesRoutes, sseRoutes } from './routes/index.js'
import { error } from 'node:console'

//TODO 
// start using nodemon
// create custom Error handler with custom errors

export const fastify = Fastify({
  logger: true
})

await fastify.register(knexPlugin)
await fastify.register(repositoriesPlugin)
await fastify.register(eventEmmiterPlugin)
await fastify.register(verifyToken, config.jwt)
await fastify.register(fastifySSE, config.rabbit)
await fastify.register(authRoutes)
await fastify.register(chatsRoutes)
await fastify.register(messagesRoutes)
await fastify.register(sseRoutes)

// test message flood
const flood = async () => {
  const members = await fastify.db.chatRepository.getMembersByChat(
    '91e65f8f-99d5-4063-84f7-beba536ee530', //chat for flood
    '5c606d02-15dc-4d67-a9ad-ba51822bfe00' // bot user
  )

  members.forEach(member => {
    fastify.event_emitter.emit(member, {
      id: '111',
      created_at: '11',
      text: 'test message',
      user_id: '5c606d02-15dc-4d67-a9ad-ba51822bfe00',
      chat_id: '91e65f8f-99d5-4063-84f7-beba536ee530'
    }) 
  })
}

const interval = setInterval(() => {
  flood().catch((error: Error) => {
    console.log('Flood has an error', error as Error)
  }
  )
}, 20000)



// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  clearInterval(interval)
  fastify.log.error(err)
  process.exit(1)
}