import Fastify from 'fastify'
import { JsonSchemaToTsProvider, FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts'
import { schemas } from './schemas.js'
import { config } from './config.js'
import { auth, createUser } from './auth_handler.js'
import { AuthBody } from './json_schemas/create_users.js'


export const fastify = Fastify({
  logger: true
}).withTypeProvider<JsonSchemaToTsProvider>()


const body = {
  type: 'object',
  properties: {
    login: { type: 'string' },
    password: { type: 'string' }
  }
} as const

const schema = {
  body: body
} as const

fastify.post<{Body:AuthBody}>('/auth', {schema}, auth)

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

// fastify.post('/api/login', schemas.auth , auth)
fastify.post('/api/users', schemas.create_users, createUser)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}