import type { User } from "./users.js"

export interface Chats {
  id: string,
  created_at: string,
  updated_at?: string | null,
  type: 'direct' | 'group' | 'channel'
}


export type CreateDBChatType = Pick<Chats, 'type'> & { user_ids: User['id'][] }