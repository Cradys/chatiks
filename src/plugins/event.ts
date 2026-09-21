import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { EventEmitter } from 'node:events'


declare module 'fastify' {
  interface FastifyInstance {
    event_emitter: EventEmitter;
  }
}

async function eventEmitterPlugin(fastify: FastifyInstance) {

  const event = new EventEmitter()

  fastify.decorate('event_emitter', event)


}

export default fp(eventEmitterPlugin, {name: 'EventEmitter'})