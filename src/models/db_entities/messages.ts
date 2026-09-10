export interface Message {
  id: string,
  created_at?: string,
  updated_at?: string | null,
  text: string,
  sender_id: string
  receiver_id: string
}

export type CreateDBMessageType = Omit<Message, 'id' | 'created_at' | 'updated_at'>
