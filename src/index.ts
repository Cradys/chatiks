import Fastify from 'fastify'
import { config } from './config.js'
import { knexPlugin, repositoriesPlugin, eventEmmiterPlugin, verifyToken } from './plugins/index.js'
import { fastifySSE } from '@fastify/sse'
import { authRoutes, chatsRoutes, messagesRoutes, sseRoutes } from './routes/index.js'

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
await fastify.register(fastifySSE)
await fastify.register(authRoutes)
await fastify.register(chatsRoutes)
await fastify.register(messagesRoutes)
await fastify.register(sseRoutes)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}