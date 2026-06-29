import Fastify from 'fastify'
import { JsonSchemaToTsProvider, FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { schemas } from './schemas.js'
import { config } from './config.js'
import { auth, createUser } from './auth_handler.js'
import { createUserSchema } from './json_schemas/create_users.js'
import { authSchema } from './json_schemas/auth.js'

//ajv options with additionalProperies
//no need to write in every schama
export const fastify = Fastify({
  logger: true
}).withTypeProvider<JsonSchemaToTsProvider>()

fastify.post('/auth', {schema: authSchema}, auth)

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

// fastify.post('/api/login', schemas.auth , auth)
fastify.post('/api/users', {schema: createUserSchema}, createUser)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}