import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { knex } from "../database"
import{ z } from 'zod'
import { randomUUID } from "crypto"
import { checkSessionIdExists } from "../middlewares/check-session-id-exists"


export async function usersRoutes(app:FastifyInstance){
    // Criar Usuário
    app.post('/', async (request, reply) => {
        
        const createUsersBodySchema = z.object({
            name: z.string(),
        })
        
        const {name} = createUsersBodySchema.parse(request.body)
        
        let sessionId = request.cookies.sessionId
        
        if(!sessionId){
            sessionId = randomUUID()
            
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 dias
            })
        }
        await knex('users').insert({
            id: randomUUID(),
            name,
            sessionId
        })
        
        return reply.status(201).send()
    })

    app.get('/', {preHandler: checkSessionIdExists},async () =>{
        
        const createUserSchema = z.object({
            // id: z.string(),
            name: z.string(),
            createdAt: z.string(),
            //sessionId: z.string()
        })

        const userSchemaList = z.array(createUserSchema)

        const users = await knex('users').select()
        
        const {data} = userSchemaList.safeParse(users)

        return {data}
    })

    // Listar Usuário por ID
    app.get('/:id', {preHandler: checkSessionIdExists},async (request, reply)=>{

        const getUsersParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getUsersParamsSchema.parse(request.params)

        const {sessionId} = request.cookies

        const user = await knex('users').where({
            id,
            sessionId
        }).first()

        if (user == null) {
            return reply.status(404).send({
                error: 'ID ou Sessão inválidos'
            })
        }

        return {user}

    })

}
export async function mealsRoutes(app:FastifyInstance){
   
    
    app.addHook('preHandler', checkSessionIdExists)
    
      // Criar Refeição
    app.post('/', async (request, reply) =>{
        const createMealsBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            diet: z.boolean()
        })

        const {name, description, diet} = createMealsBodySchema.parse(request.body)

        const userId = await getIdbySessionId(request, reply)

        if(!userId){
            return reply.status(404).send({
                error: 'Usuário inválido'
            })
        }

        await knex('meals').insert({
            id: randomUUID(),
            name,
            description,
            diet,
            userId: userId.id
        })

        return reply.status(200).send()
    })

    // Listar Refeições
    app.get('/', async (request, reply) => {
        
        const {id} = await getIdbySessionId(request, reply)

        console.log(id)

        const meals = await knex('meals')
            .where({userId: id})
            .select()

        const countMeals = meals.length
        return {countMeals, meals}
        
    })

    // Contar refeições dentro e fora da dieta
    app.get('/count', async (request, reply) => {
       
        const mealsCount = await knex('meals')
            .select(
                knex.raw("COUNT(CASE WHEN diet = 1 THEN 1 END) as diet"),
                knex.raw("COUNT(CASE WHEN diet = 0 THEN 1 END) as notDiet")
            )
            .first(); // Para retornar um objeto ao invés de array

        return {mealsCount}
    })

    app.put('/:id', async (request, reply)=> {

        const createMealsBodySchema = z.object({
            id: z.string()
        })

        const id = createMealsBodySchema.parse(request.params)

    })
}

async function getIdbySessionId (request:FastifyRequest, reply:FastifyReply){

    const { sessionId } = request.cookies

    const {id} = await knex('users').select('id').where({sessionId}).first()

    if(!id || !sessionId){
       return reply.status(404).send({
        error: 'ID ou Sessão do usuário inválidos'
       })
    }

    return {id, sessionId}
   
}