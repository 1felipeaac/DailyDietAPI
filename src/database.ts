import {knex as setupKnex} from 'knex'

export const knex = setupKnex({
    client: 'sqlite',
    connection: {
        filename: './db/app.db'
    },
})