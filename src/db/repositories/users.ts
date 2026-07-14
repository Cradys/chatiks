import type { Knex } from "knex"
import type { Entities } from "../../models/index.js"

type User = Entities.User
type CreateUserType = Omit<Entities.User, 'id' | 'created_at'>


export class UserRepository {

  constructor(private knex: Knex) {
  }

  async createUser(data: CreateUserType): Promise<User> {
    const [user] = await this.knex<User>('users').insert(data, '*')
    
    return user
  }

  async isUserExistByLogin(login: string): Promise<boolean> {
    const user = await this.knex<User>('users').select('id').where('login', login).first()

    if (!user) { //user not found
      return false
    }
    return true
  }
}