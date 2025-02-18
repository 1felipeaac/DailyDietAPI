import { table } from "console";
import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) =>{
        table.uuid('id').primary()
        table.text('name').notNullable()
        table.text('description').notNullable()
        table.boolean('diet').notNullable()
        table.timestamp('createdAt').defaultTo(knex.fn.now()).notNullable()
        table.uuid('userId').notNullable().references('id').inTable('users').onDelete('CASCADE')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals')
}

