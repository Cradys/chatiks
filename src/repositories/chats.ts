import type { Knex } from "knex"
import { Entities } from "../models/index.js"


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

  async getOne(chat_id: Entities.Chats.Chats['id']): Promise<Entities.Chats.Chats & {user_ids: Entities.User.User['id'][]}> {
    const chat = await this.knex<Entities.Chats.Chats>('chats')
      .select()
      .where({ id: chat_id })
      .first()
    
    if (!chat) {
      throw new Error('chat does not exist')
    }
    
    const members = await this.knex<Entities.ChatsToUsers.ChatsToUsers>('chats_to_users')
      .select('user_id')
      .where({chat_id: chat_id})


    console.log(chat)
    return {
      ...chat,
      user_ids: members.map(m => m.user_id)
    }
  }

  async listChats(user_id: string, limit=30, offset=0): Promise<
  (Pick<Entities.ChatsToUsers.ChatsToUsers, 'created_at' | 'updated_at'> 
    & Pick<Entities.Chats.Chats, 'id' | 'type'>)[]> {

    const query = this.knex<Entities.ChatsToUsers.ChatsToUsers>('chats_to_users as cu')
      .select('c.id', 'cu.created_at', 'cu.updated_at', 'c.type')
      .join<Entities.Chats.Chats>('chats as c', 'c.id', '=', 'cu.chat_id')
      .where('cu.user_id', user_id)
      .limit(limit)
      .offset(offset)
    
    console.log(query.toString())
    
    const chats = await query

    return chats
  }
}