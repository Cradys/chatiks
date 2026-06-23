export const auth_schema = {
  body: {
    $id: 'auth',
    type: 'object',
    required: ['login', 'password'],
    properties: {
      login: { type: 'string' },
      password: { type: 'string' }
    }
  }
}