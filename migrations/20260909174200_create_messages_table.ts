import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  
  await knex.schema.createTable('chats', (table) => {
    table.uuid('id', {primaryKey: true}).defaultTo(knex.fn.uuid())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.enum('type', ['direct', 'group'])
  })

  await knex.schema.raw(`
    CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON chats
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `)

  await knex.schema.createTable('chats_to_users', (table) => {
    table.uuid('id', {primaryKey: true}).defaultTo(knex.fn.uuid())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.uuid('chat_id').references('chats.id').notNullable().index().onDelete('CASCADE')
    table.uuid('user_id').references('users.id').notNullable().index().onDelete('RESTRICT')

    table.unique(['chat_id', 'user_id'])
  })

  await knex.schema.raw(`
    CREATE TRIGGER update_chats_to_users_updated_at
    BEFORE UPDATE ON chats_to_users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `)

  await knex.schema.createTable('messages', function(table) {
    table.uuid('id', {primaryKey: true}).defaultTo(knex.fn.uuid())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.text('text').notNullable().checkLength('<=', 10000)
    table.uuid('chat_id').references('chats.id').index().notNullable().onDelete('CASCADE')
    table.uuid('sender_id').references('users.id').index().notNullable().onDelete('RESTRICT')
  })

  await knex.schema.raw(`
    CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('messages')
  await knex.schema.dropTableIfExists('chats_to_users')
  await knex.schema.dropTableIfExists('chats')
}

