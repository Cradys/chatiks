import { type FastifyRequest, type FastifyReply } from "fastify";
import type { DTO } from "../models/index.js";


export async function createMessage(req: FastifyRequest<DTO.CreateMessageType>, reply: FastifyReply<DTO.CreateMessageType>) {
  const message = await req.server.db.messageRepository.create(req.body)

  req.server.message_emitter.emit(message.chat_id, message)

  reply.code(200).send({
    id: message.id
  })
}