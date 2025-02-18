import { Knex } from "knex";

declare module 'knex/types/tables'{
    export interface Table{
        users:{
            id: string
            sessionId: string
            name: string
            createdAt: string
        },
        meals:{
            id: string
            name: string
            description: string
            diet: boolean
            createdAt: string
            userId: string
        }
    }
}