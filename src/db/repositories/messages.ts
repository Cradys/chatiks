import type { Knex } from "knex"
import type { Entities } from "../../models/index.js"


export class MessageRepository {

  constructor(private readonly knex: Knex) {
  }

  async createMessage(data: Entities.Message.CreateDBMessageType): Promise<string> {
    const [message] = await this.knex<Entities.Message.Message>('messages').insert(data, 'id')
    return message.id
  }

  async getMessages(sender_id: string, receiver_id: string, limit: number, offset: number): Promise<Entities.Message.Message[]> {
    const messages = await this.knex<Entities.Message.Message>('messages')
      .select()
      .where({
        sender_id: sender_id,
        receiver_id: receiver_id
      }).orWhere({
        sender_id: receiver_id,
        receiver_id: sender_id
      })
      .orderBy('created_at', 'desc')
      .limit(limit < 30 ? limit: 30)
      .offset(offset)
    
    return messages
  }
}