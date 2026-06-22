// Import the framework and instantiate it
import Fastify from 'fastify'
import { auth_schema } from './schemas.js'
import { auth } from './auth_handler.js'

export const fastify = Fastify({
  logger: true
})


// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})
const schema = fastify.getSchema('auth')

fastify.post('/auth', { schema: auth_schema }, auth)

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}