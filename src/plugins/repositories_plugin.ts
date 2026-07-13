import { FastifyInstance } from "fastify";
import fp from 'fastify-plugin'
import { UserRepository } from "../db/repositories/users.js";

async function repositoriesPlugin(fastify: FastifyInstance) {
  
  const userRepository = new UserRepository(fastify.knex)
}