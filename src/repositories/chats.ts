import type { Knex } from "knex"
import type { Entities } from "../models/index.js"


export class ChatRepository {

  constructor(private readonly knex: Knex) {}

  async create(data: Entities.Chats.CreateDBChatType): Promise<Entities.Chats.Chats> {
    try {
      return await this.knex.transaction(async (trx) => {
        const [chat] = await trx<Entities.Chats.Chats>('chats').insert({type: data.type}, "*")

        const members = await trx<Entities.ChatsToUsers.ChatsToUsers>('chats_to_users')
        .insert(data.user_ids.map(user_id => ({user_id: user_id, chat_id: chat.id })))
        
        return chat
      })
    } catch (error) {
      console.log('DB error\n', (error as Error).message)
      throw error
    }
  }
}