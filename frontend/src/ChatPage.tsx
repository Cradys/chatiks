import { useEffect, useState } from 'react'
import { ActionIcon, Avatar, Group, Paper, ScrollArea, Stack, Text, TextInput, Title } from '@mantine/core'
import { IconArrowLeft, IconSend } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import * as api from './api'
import type { Message, Session } from './types'

type Props = {
  session: Session
  chatId: string
  messages: Message[]
  onMessageSent: (message: Message) => void
  onBack: () => void
}

function sortByDate(messages: Message[]) {
  return [...messages].sort((a, b) => a.created_at.localeCompare(b.created_at))
}

function dedupeMerge(base: Message[], incoming: Message[]) {
  const byId = new Map(base.map((m) => [m.id, m]))
  for (const message of incoming) byId.set(message.id, message)
  return sortByDate([...byId.values()])
}

export function ChatPage({ session, chatId, messages, onMessageSent, onBack }: Props) {
  const [history, setHistory] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.listMessages(chatId, session.token)
      .then((data) => {
        if (!cancelled) setHistory(sortByDate(data))
      })
      .catch((err) => notifications.show({ color: 'red', title: 'Не вдалось завантажити повідомлення', message: (err as Error).message }))
    return () => { cancelled = true }
  }, [chatId])

  useEffect(() => {
    if (messages.length === 0) return
    setHistory((prev) => dedupeMerge(prev, messages))
  }, [messages])

  async function send() {
    const value = text.trim()
    if (!value) return
    setSending(true)
    try {
      const { id } = await api.sendMessage(chatId, value, session.id, session.token)
      onMessageSent({
        id,
        chat_id: chatId,
        text: value,
        sender_id: session.id,
        created_at: new Date().toISOString(),
        updated_at: null
      })
      setText('')
    } catch (err) {
      notifications.show({ color: 'red', title: 'Не вдалось надіслати', message: (err as Error).message })
    } finally {
      setSending(false)
    }
  }

  return (
    <Stack h="100%" p="md" gap="sm">
      <Group>
        <ActionIcon variant="subtle" onClick={onBack}>
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Title order={4}>Чат</Title>
      </Group>

      <ScrollArea style={{ flex: 1 }} offsetScrollbars>
        <Stack gap="xs" p="xs">
          {history.map((message) => {
            const isMine = message.sender_id === session.id
            return (
              <Group key={message.id} justify={isMine ? 'flex-end' : 'flex-start'} gap="xs" wrap="nowrap">
                {!isMine && <Avatar size="sm" radius="xl">{message.sender_id.slice(0, 2)}</Avatar>}
                <Paper
                  withBorder
                  p="xs"
                  radius="md"
                  bg={isMine ? 'blue.6' : undefined}
                  c={isMine ? 'white' : undefined}
                  style={{ maxWidth: '70%' }}
                >
                  <Text size="sm">{message.text}</Text>
                </Paper>
              </Group>
            )
          })}
        </Stack>
      </ScrollArea>

      <Group gap="xs">
        <TextInput
          style={{ flex: 1 }}
          placeholder="Повідомлення..."
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send() }}
        />
        <ActionIcon size="lg" onClick={send} loading={sending} disabled={!text.trim()}>
          <IconSend size={18} />
        </ActionIcon>
      </Group>
    </Stack>
  )
}
