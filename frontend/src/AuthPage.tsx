import { useState } from 'react'
import { Button, Paper, PasswordInput, SegmentedControl, Stack, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import * as api from './api'
import type { Session } from './types'

type Props = {
  onAuth: (session: Session) => void
}

export function AuthPage({ onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    try {
      const session = mode === 'login'
        ? await api.login(loginValue, password)
        : await api.register(loginValue, password)
      onAuth(session)
    } catch (err) {
      notifications.show({
        color: 'red',
        title: mode === 'login' ? 'Не вдалось увійти' : 'Не вдалось зареєструватись',
        message: (err as Error).message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack align="center" justify="center" h="100%">
      <Paper withBorder shadow="sm" p="xl" w={360}>
        <Stack>
          <Title order={3} ta="center">Chatiks</Title>
          <SegmentedControl
            fullWidth
            value={mode}
            onChange={(v) => setMode(v as 'login' | 'register')}
            data={[
              { label: 'Увійти', value: 'login' },
              { label: 'Реєстрація', value: 'register' }
            ]}
          />
          <TextInput
            label="Логін"
            value={loginValue}
            onChange={(e) => setLoginValue(e.currentTarget.value)}
          />
          <PasswordInput
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
          <Button onClick={submit} loading={loading}>
            {mode === 'login' ? 'Увійти' : 'Зареєструватись'}
          </Button>
        </Stack>
      </Paper>
    </Stack>
  )
}
