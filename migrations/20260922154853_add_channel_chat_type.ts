import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE chats DROP CONSTRAINT chats_type_check;
    ALTER TABLE chats ADD CONSTRAINT chats_type_check
    CHECK (type IN ('direct', 'group', 'channel'));
  `)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.raw(`
    ALTER TABLE chats DROP CONSTRAINT chats_type_check;
    ALTER TABLE chats ADD CONSTRAINT chats_type_check
    CHECK (type IN ('direct', 'group'));
  `)
}

