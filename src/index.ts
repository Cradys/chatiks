import Fastify from 'fastify'
import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts'
import { config } from './config.js'
import { auth, createUserHandler } from './handler/auth_handler.js'
import { authSchema, createUserSchema } from './models/dto/index.js'
import { UserRepository } from './db/repositories/users.js'
import { knexPlugin } from './plugins/index.js'

//ajv options with additionalProperies
//no need to write in every schama
export const fastify = Fastify({
  logger: true
}).withTypeProvider<JsonSchemaToTsProvider>()

fastify.register(knexPlugin)

//TODO plagin with UserRepository and test

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