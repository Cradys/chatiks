import { type FastifyRequest, type FastifyReply } from "fastify";
import type { Message } from "../../models/entities/index.js" 
import type { DTO } from "../../models/index.js";

export async function sseHandler(req: FastifyRequest<DTO.SSEChatsType>, reply: FastifyReply) {
  const payload = await req.server.verifyToken(req.headers.authorization)

  reply.sse.sendHeaders()
  reply.sse.keepAlive()

  // Check if keepAlive was called
  console.log('Keep alive status:', reply.sse.shouldKeepAlive) // true


  const channel = await req.server.rbbt_conn.createChannel()

  const q = await channel.assertQueue('', {
    exclusive: true,
    autoDelete: true
  })

  await channel.bindQueue(q.queue, 'messages', payload.user_id)

  channel.consume(q.queue, (msg) => {
    if (!msg) return
    const message = JSON.parse(msg.content.toString())
    reply.sse.send({data: message})
    channel.ack(msg)
  })


  reply.sse.onClose(() => {
    channel.close()
    console.log('Connection closed')
  })
}
