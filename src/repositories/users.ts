import type { Knex } from "knex"
import type { Entities } from "../models/index.js"


export class UserRepository {

  constructor(private readonly knex: Knex) {
  }

  async create(data: Entities.User.CreateDBUserType ): Promise<Entities.User.User> {
    const [user] = await this.knex<Entities.User.User>('users').insert(data, '*')
    return user
  }

  async getUserByLogin(login: string): Promise<Entities.User.User | undefined> {
    const user = await this.knex<Entities.User.User>('users').select().where('login', login).first()
    return user
  }
}