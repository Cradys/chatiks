import type { User } from "./users.js"
import type { Chats } from "./chats.js"

export interface ChatsToUsers {
  id: string,
  created_at: string,
  updated_at?: string | null,
  chat_id: Chats['id'],
  user_id: User['id']
}