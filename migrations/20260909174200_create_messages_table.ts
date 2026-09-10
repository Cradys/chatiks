import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('messages', function(table) {
    table.uuid('id', {primaryKey: true}).defaultTo(knex.fn.uuid())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.text('text').notNullable()
    table.uuid('sender_id').references('users.id').index().notNullable().onDelete('RESTRICT')
    table.uuid('receiver_id').references('users.id').index().notNullable().onDelete('RESTRICT')
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
}

