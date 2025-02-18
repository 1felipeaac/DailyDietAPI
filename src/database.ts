import {knex as setupKnex} from 'knex'
import { env } from './env'

if(!env.DATABASE_URL){
    throw new Error('DATABASE_URL não encontrado')
}
export const config = {
    client: 'sqlite',
    connection: {
        filename: env.DATABASE_URL
    },
    useNullAsDefault: true,
}
export const knex = setupKnex(config)