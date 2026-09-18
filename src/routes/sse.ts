import { FastifyInstance } from "fastify";
import fp from 'fastify-plugin'
import { sseHandler } from './handlers/sse_handler.js'
import { DTO } from "../models/index.js"


async function sse(fastify: FastifyInstance) {
  let compiledSerializer: ((data: unknown) => string) | undefined

  function message_serializer(data: unknown): string {
    if (compiledSerializer === undefined) {
      if (!fastify.serializerCompiler) {
        throw new Error('serializerCompiler is not ready yet')
      }
      compiledSerializer = fastify.serializerCompiler({
        schema: DTO.sseChatsSchema.response[200],
        method: "GET",
        url: '/api/chats/:id/sse'
      })
    }
    return compiledSerializer(data)
  }


  fastify.get('/api/chats/:id/sse', {sse: {
    kind: 'only',
    serializer: message_serializer
  }}, sseHandler)
}

export default fp(sse, {name: 'SSERoutes', dependencies: ['repositoriesPlugin']})