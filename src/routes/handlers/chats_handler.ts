import { type FastifyRequest, type FastifyReply } from "fastify";
import type { DTO } from "../../models/index.js";


export async function createChat(req: FastifyRequest<DTO.CreateChatType>, reply: FastifyReply<DTO.CreateChatType>) {
  if (req.body.user_ids.length < 2) {
    throw new Error("Chat must have minimum 2 members")
  }

  if (req.body.type === 'direct' && req.body.user_ids.length > 2) {
    throw new Error("Direct chat must have only two members")
  }

  const chat = await req.server.db.chatRepository.create(req.body)
  reply.code(200).send({id: chat.id})
}

export async function getChat(req: FastifyRequest<DTO.GetChatType>, reply: FastifyReply<DTO.GetChatType>) {
  const chat = await req.server.db.chatRepository.getOne(req.params.id)
  reply.code(200).send(chat)
}

export async function listChats(req: FastifyRequest<DTO.ListChatsType>, reply: FastifyReply<DTO.ListChatsType>) {
  const chats = await req.server.db.chatRepository.listChats(req.query.user_id)

  reply.code(200).send(chats)
}