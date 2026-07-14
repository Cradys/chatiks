import Fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import { config } from './config.js'
import { auth, createUserHandler } from './handler/auth_handler.js'
import { authSchema, createUserSchema } from './models/dto/index.js'
import { knexPlugin, repositoriesPlugin } from './plugins/index.js'

//TODO 
// start using nodemon
// create custom Error handler with custom errors

export const fastify = Fastify({
  logger: true
})
  .withTypeProvider<JsonSchemaToTsProvider>()

fastify.register(knexPlugin)
fastify.register(repositoriesPlugin)


fastify.post('/auth', {schema: authSchema}, auth)

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

// fastify.post('/api/login', schemas.auth , auth)
fastify.post('/api/users', {schema: createUserSchema}, createUserHandler)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}