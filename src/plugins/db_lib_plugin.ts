import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import knex, { type Knex } from 'knex'
import { config } from '../config.js'

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
  }
}

async function knexPlugin(fastify: FastifyInstance) {

  const knexInstance = knex({
    client: config.db.client,
    connection: config.db.db_url,
  })

  fastify.decorate('knex', knexInstance)

  fastify.addHook("onClose", async (fastify) => {
    await fastify.knex.destroy();
    fastify.log.info("Knex connection closed.");
  });

}

export default fp(knexPlugin, {name: 'knexPlugin'})