import Fastify from 'fastify'
import knex from 'knex'
import { schemas } from './schemas.js'
import { config } from './config.js'
import { auth, createUser } from './auth_handler.js'


export const fastify = Fastify({
  logger: true
})

// const pg = knex({
//   client: 'pg',
//   connection: config.db.db_url,
//   searchPath: ['knex', 'public']
// })

// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

fastify.post('/api/login', schemas.auth , auth)
fastify.post('/api/users', createUser)

// Run the server!
try {
  await fastify.listen({ port: config.api.port })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}