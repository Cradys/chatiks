// Import the framework and instantiate it
import Fastify from 'fastify'
import { auth_schema } from './schemas.js'
import { auth } from './auth_handler.js'
import fs from 'node:fs'
import path from 'node:path'

export const fastify = Fastify({
  logger: true
})

const files = fs.readdirSync('./json_schemas')
let schemas: Record<string, Record<string, any>> = {}

files.forEach(file => {
  const content = fs.readFileSync(`./json_schemas/${file}`)
  schemas[path.parse(file).name] = {schema: JSON.parse(content.toString()).properties}
});


// Declare a route
fastify.get('/', async function handler (request, reply) {
  return { hello: 'world' }
})

fastify.post('/auth', schemas.auth , auth)

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}