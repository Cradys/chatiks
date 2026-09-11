import type { User } from "./users.js"
import type { Chats } from "./chats.js"

export interface Message {
  id: string,
  created_at?: string,
  updated_at?: string | null,
  text: string,
  chat_id: Chats['id'],
  sender_id: User['id']
}

export type CreateDBMessageType = Omit<Message, 'id' | 'created_at' | 'updated_at'>
