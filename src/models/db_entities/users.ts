export interface User {
  id: string,
  created_at?: string,
  updated_at?: string | null,
  login: string,
  name?: string | null,
  password: string,
  phone_number?:string | null
}