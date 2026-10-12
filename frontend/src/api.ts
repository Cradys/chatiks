import type { Chat, ChatDetails, Message, Session } from './types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? `Request failed with status ${res.status}`)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export function register(login: string, password: string) {
  return request<Session>('/api/users', {
    method: 'POST',
    body: JSON.stringify({ login, password })
  })
}

export function login(login: string, password: string) {
  return request<Session>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ login, password })
  })
}

export function listChats(userId: string, token: string) {
  return request<Chat[]>(`/api/chats?user_id=${encodeURIComponent(userId)}`, {}, token)
}

export function getChat(chatId: string, token: string) {
  return request<ChatDetails>(`/api/chats/${chatId}`, {}, token)
}

export function createChat(otherUserId: string, myUserId: string, token: string) {
  return request<{ id: string }>('/api/chats', {
    method: 'POST',
    body: JSON.stringify({ type: 'direct', user_ids: [myUserId, otherUserId] })
  }, token)
}

export function listMessages(chatId: string, token: string) {
  return request<Message[]>(`/api/messages?chat_id=${encodeURIComponent(chatId)}`, {}, token)
}

export function sendMessage(chatId: string, text: string, senderId: string, token: string) {
  return request<{ id: string }>('/api/messages', {
    method: 'POST',
    body: JSON.stringify({ chat_id: chatId, text, sender_id: senderId })
  }, token)
}

export { API_URL }
