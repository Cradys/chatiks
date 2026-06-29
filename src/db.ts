import knex from "knex";

//TODO
// one DB config file for project
const db = knex({
  client: 'pg',
  connection: process.env.DB_URL
})

export default db