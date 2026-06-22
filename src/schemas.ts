export const auth_schema = {
  body: {
    $id: 'auth',
    type: 'object',
    properties: {
      login: { type: 'string' },
      password: { type: 'string' }
    }
  }
}