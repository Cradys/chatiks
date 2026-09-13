import type { RouteHandler } from "fastify"
import type { Message } from "../models/entities/index.js" 

export const test_sse: RouteHandler = async(req, reply) => {
  reply.sse.keepAlive()

  // Send initial message
  await reply.sse.send({ data: 'Connected' })

  // Check if keepAlive was called
  console.log('Keep alive status:', reply.sse.shouldKeepAlive) // true

  const listener = function(message: Message.Message) {
    reply.sse.send({data: message})
  }

  req.server.message_emitter.on((req.params as {chat_id: string}).chat_id, listener)

  reply.sse.onClose(() => {
    req.server.message_emitter.off((req.params as {chat_id: string}).chat_id, listener)
    console.log('Connection closed')
  })
}
