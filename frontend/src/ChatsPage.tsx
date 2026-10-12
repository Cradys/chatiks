import { useEffect, useState } from 'react'
import { Badge, Button, Group, Modal, Paper, ScrollArea, Stack, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import * as api from './api'
import type { Chat, Session } from './types'

type Props = {
  session: Session
  onOpenChat: (chatId: string) => void
  onLogout: () => void
}

export function ChatsPage({ session, onOpenChat, onLogout }: Props) {
  const [chats, setChats] = useState<Chat[]>([])
  const [loading, setLoading] = useState(true)
  const [opened, { open, close }] = useDisclosure(false)
  const [otherUserId, setOtherUserId] = useState('')

  async function refresh() {
    setLoading(true)
    try {
      const data = await api.listChats(session.id, session.token)
      setChats(data)
    } catch (err) {
      notifications.show({ color: 'red', title: 'Не вдалось завантажити чати', message: (err as Error).message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function createChat() {
    try {
      const { id } = await api.createChat(otherUserId.trim(), session.id, session.token)
      close()
      setOtherUserId('')
      await refresh()
      onOpenChat(id)
    } catch (err) {
      notifications.show({ color: 'red', title: 'Не вдалось створити чат', message: (err as Error).message })
    }
  }

  function copyMyId() {
    navigator.clipboard.writeText(session.id)
    notifications.show({ message: 'ID скопійовано — поділись ним, щоб з тобою створили чат' })
  }

  return (
    <Stack h="100%" p="md" gap="sm">
      <Group justify="space-between">
        <Title order={3}>Чати</Title>
        <Group gap="xs">
          <Tooltip label="Скопіювати свій user_id, щоб поділитись ним">
            <Button variant="light" size="xs" onClick={copyMyId}>Мій ID</Button>
          </Tooltip>
          <Button size="xs" onClick={open}>+ Новий чат</Button>
          <Button size="xs" variant="subtle" color="red" onClick={onLogout}>Вийти</Button>
        </Group>
      </Group>

      <ScrollArea style={{ flex: 1 }}>
        <Stack gap="xs">
          {!loading && chats.length === 0 && (
            <Text c="dimmed" ta="center" mt="xl">Немає чатів. Створи новий.</Text>
          )}
          {chats.map((chat) => (
            <Paper
              key={chat.id}
              withBorder
              p="sm"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenChat(chat.id)}
            >
              <Group justify="space-between">
                <Text size="sm" truncate style={{ maxWidth: 240 }}>{chat.id}</Text>
                <Badge variant="light">{chat.type}</Badge>
              </Group>
            </Paper>
          ))}
        </Stack>
      </ScrollArea>

      <Modal opened={opened} onClose={close} title="Новий чат">
        <Stack>
          <TextInput
            label="User ID співрозмовника"
            placeholder="встав ID, яким поділився інший користувач"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.currentTarget.value)}
          />
          <Button onClick={createChat} disabled={!otherUserId.trim()}>Створити</Button>
        </Stack>
      </Modal>
    </Stack>
  )
}
