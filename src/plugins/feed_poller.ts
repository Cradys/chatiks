import fp from 'fastify-plugin'
import { FastifyInstance } from "fastify";
import { type Config } from '../config.js';

async function feedPoller(fastify: FastifyInstance, rss_config: Config['rss']) {
  
}

export default fp(feedPoller, {name: 'feedPoller', dependencies: ['repositoriesPlugin']})