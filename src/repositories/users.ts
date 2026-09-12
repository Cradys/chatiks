import type { Knex } from "knex"
import type { Entities } from "../models/index.js"


export class UserRepository {

  constructor(private readonly knex: Knex) {
  }

  async create(data: Entities.User.CreateDBUserType ): Promise<Entities.User.User> {
    const [user] = await this.knex<Entities.User.User>('users').insert(data, '*')
    return user
  }

  async isUserExistByLogin(login: string): Promise<boolean> {
    const user = await this.knex<Entities.User.User>('users').select('id').where('login', login).first()

    if (!user) { //user not found
      return false
    }
    return true
  }
}