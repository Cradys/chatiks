import { type FastifyRequest, type FastifyReply } from "fastify";
import type { Message } from "../../models/entities/index.js" 
import type { DTO } from "../../models/index.js";

export async function sseHandler(req: FastifyRequest<DTO.SSEChatsType>, reply: FastifyReply) {
  const payload = await req.server.verifyToken(req.headers.authorization)

  reply.sse.sendHeaders()
  reply.sse.keepAlive()

  // Check if keepAlive was called
  console.log('Keep alive status:', reply.sse.shouldKeepAlive) // true

  const listener = function(message: Message.Message) {
    console.log(message)
    reply.sse.send({data: message})
  }

  req.server.event_emitter.on(payload.user_id, listener)

  reply.sse.onClose(() => {
    req.server.event_emitter.off(payload.user_id, listener)
    console.log('Connection closed')
  })
}
