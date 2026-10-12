export type Chat = {
  id: string
  created_at: string
  updated_at: string | null
  type: 'direct' | 'group'
}

export type ChatDetails = Chat & {
  user_ids: string[]
}

export type Message = {
  id: string
  created_at: string
  updated_at: string | null
  text: string
  sender_id: string
}

export type Session = {
  id: string
  token: string
}
