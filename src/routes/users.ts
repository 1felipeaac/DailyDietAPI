import { FastifyInstance } from "fastify"
import { knex } from "../database"
import{ z } from 'zod'
import { randomUUID } from "crypto"

export async  function usersRoutes(app:FastifyInstance){
    app.post('/', async (request, reply) => {

        const createUsersBodySchema = z.object({
            name: z.string(),
            sessionId: z.string()
        })

        const {name, sessionId} = createUsersBodySchema.parse(request.body)
        await knex('users').insert({
            id: randomUUID(),
            name,
            sessionId
        })

        return reply.status(201).send()
    })
}