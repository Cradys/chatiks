import type { Knex } from "knex"
import type { Entities } from "../models/index.js"


export class MessageRepository {

  constructor(private readonly knex: Knex) {}

  async create(data: Entities.Message.CreateDBMessageType): Promise<string> {
    const [message] = await this.knex<Entities.Message.Message>('messages').insert(data, 'id')
    return message.id
  }

  async getByChatId(chat_id: string, limit=20, offset=0): Promise<Entities.Message.Message[]> {
    const messages = await this.knex<Entities.Message.Message>('messages')
      .select()
      .where({
        chat_id: chat_id
      })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset)
    
    return messages
  }
}