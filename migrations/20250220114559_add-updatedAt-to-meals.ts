import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) =>{
        table.timestamp('updatedAt').after('createdAt').defaultTo(null)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('meals', (table) =>{
        table.dropColumn('updatedAt')
    })
}

