import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createSchemaIfNotExists('users')
  await knex.schema.withSchema('users').createTable('users', function(table) {
    table.uuid('id', {primaryKey: true}).defaultTo(knex.fn.uuid())
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now())
    table.timestamp('updated_at')
    table.string('name', 255).notNullable()
    table.string('phone_number', 64)
  })

  await knex.schema.raw(
    `
      CREATE OR REPLACE FUNCTION users.update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `
  )
  await knex.schema.raw(`
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users.users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
  `)
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema('users').dropTableIfExists('users')
  await knex.schema.raw('DROP FUNCTION IF EXISTS users.update_updated_at_column CASCADE;')
  await knex.schema.dropSchemaIfExists('users')
}

