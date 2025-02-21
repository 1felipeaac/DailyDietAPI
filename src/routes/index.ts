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
            id: z.string(),
            name: z.string(),
            createdAt: z.string(),
            sessionId: z.string()
        })

        const userSchemaList = z.array(createUserSchema)

        const usersList = await knex('users').select()
        
        const list = userSchemaList.safeParse(usersList)

        const users = list.data

        return {users}
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

    // Listar Refeições; melhor sequencia de dieta; quantidade de refeição por usuário
    app.get('/', async (request, reply) => {
        
        const {id} = await getIdbySessionId(request, reply)

        const meals = await knex('meals')
            .where({userId: id})
            .select()

        const countMeals = meals.length
        let listDiet: boolean[] = []

        meals.map((meal) => {
            listDiet.push(meal.diet)
        })

        const bestDiet = maxSequence(listDiet, 1)

        return {countMeals, bestDiet ,meals }
        
    })

    // Contar refeições dentro e fora da dieta
    app.get('/count', async (request, reply) => {

        const {id} = await getIdbySessionId(request, reply)
       
        const mealsCount = await knex('meals')
            .select(
                knex.raw("COUNT(CASE WHEN diet = 1 THEN 1 END) as diet"),
                knex.raw("COUNT(CASE WHEN diet = 0 THEN 1 END) as notDiet")
            )
            .where({userId: id})
            .first(); // Para retornar um objeto ao invés de array

        return {mealsCount}
    })

    // Editar Refeição
    app.put('/:id', async (request, reply)=> {

        const createMealsParmsSchema = z.object({
            id: z.string()
        })

        const idMeal = createMealsParmsSchema.parse(request.params)

        const createMealsBodySchema = z.object({
            name: z.string().optional(),
            description: z.string().optional(),
            diet: z.boolean().optional()
        })
        const { name, description, diet} = createMealsBodySchema.parse(request.body)
        
        const {id} = await getIdbySessionId(request, reply) 
        
        const mealExists = await knex('meals')
            .where({ id: idMeal.id, userId: id })
            .first();
        
        if (!mealExists) {
            return reply.status(404).send({ error: "Refeição não encontrada" });
        }

        name === undefined ? mealExists.name : name
        description === undefined ? mealExists.description : description
        diet === undefined ? mealExists.diet : diet

        await knex('meals')
            .where({
                id: idMeal.id,
                userId: id
            })
            .update({
                name,
                description,
                diet,
                updatedAt: knex.fn.now()
            })

        return reply.status(200).send({
            status: `Refeição atualizada com sucesso!`
        })

    })

    // Excluir Refeição
    app.delete('/:id', async (request, reply) => {
        const createMealsParmsSchema = z.object({
            id: z.string()
        })

        const idMeal = createMealsParmsSchema.parse(request.params)

        await knex('meals').where({id: idMeal.id}).del()

        return reply.status(204).send({message: "Registo Excluído!"})
    })

}

async function getIdbySessionId (request:FastifyRequest, reply:FastifyReply){

    const { sessionId } = request.cookies

    const user = await knex('users').select('id').where({sessionId}).first()

    if(user === null || user === undefined){
        return reply.status(404).send({
            error: 'ID ou Sessão do usuário inválidos'
        })
    }

    const id = user.id

    return {id, sessionId}
   
}

function maxSequence(list: boolean[], target: number){
    let sequence = 0
    let maxSequence = 0;

    for (let diet of list){
        if(Number(diet) === target){
            sequence++
            maxSequence = Math.max(maxSequence, sequence)
        }else{
            sequence = 0
        }
    }

    return maxSequence
}