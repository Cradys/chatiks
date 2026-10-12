import { useEffect, useRef, useState } from 'react'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { AuthPage } from './AuthPage'
import { ChatsPage } from './ChatsPage'
import { ChatPage } from './ChatPage'
import { API_URL } from './api'
import type { Message, Session } from './types'

const SESSION_KEY = 'chatiks_session'

function loadSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY)
  return raw ? JSON.parse(raw) : null
}

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [messagesByChat, setMessagesByChat] = useState<Record<string, Message[]>>({})
  const abortRef = useRef<AbortController | null>(null)

  function appendMessage(message: Message) {
    setMessagesByChat((prev) => {
      const existing = prev[message.chat_id] ?? []
      if (existing.some((m) => m.id === message.id)) return prev
      return { ...prev, [message.chat_id]: [...existing, message] }
    })
  }

  useEffect(() => {
    if (!session) return

    const controller = new AbortController()
    abortRef.current = controller

    fetchEventSource(`${API_URL}/api/sse`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${session.token}` },
      openWhenHidden: true,
      async onopen(res) {
        if (!res.ok) throw new Error(`SSE connection failed: ${res.status}`)
      },
      onmessage(ev) {
        if (!ev.data) return
        const message = JSON.parse(ev.data) as Message
        appendMessage(message)
      },
      onerror(err) {
        console.error('SSE error', err)
        // rethrow nothing -> let the library keep retrying with backoff
      }
    })

    return () => controller.abort()
  }, [session?.token])

  function handleAuth(newSession: Session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession))
    setSession(newSession)
  }

  function handleLogout() {
    abortRef.current?.abort()
    localStorage.removeItem(SESSION_KEY)
    setSession(null)
    setActiveChatId(null)
    setMessagesByChat({})
  }

  if (!session) {
    return <AuthPage onAuth={handleAuth} />
  }

  if (activeChatId) {
    return (
      <ChatPage
        session={session}
        chatId={activeChatId}
        messages={messagesByChat[activeChatId] ?? []}
        onMessageSent={appendMessage}
        onBack={() => setActiveChatId(null)}
      />
    )
  }

  return (
    <ChatsPage
      session={session}
      onOpenChat={setActiveChatId}
      onLogout={handleLogout}
    />
  )
}
