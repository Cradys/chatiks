import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import knex, { type Knex } from 'knex'

declare module 'fastify' {
  interface FastifyInstance {
    knex: Knex;
  }
}

async function knexPlugin(fastify: FastifyInstance) {
  const config: Knex.Config = {
    client: 'pg',
    connection: process.env.DB_URL,
  }

  const knexInstance = knex(config)

  fastify.decorate('knex', knexInstance)

  fastify.addHook("onClose", async (fastify) => {
    await fastify.knex.destroy();
    fastify.log.info("Knex connection closed.");
  });

}

export default fp(knexPlugin)