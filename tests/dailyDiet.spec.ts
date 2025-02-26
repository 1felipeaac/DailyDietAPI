import {beforeAll, afterAll, it, describe, expect, beforeEach} from 'vitest'
import {execSync} from 'node:child_process'
import request from 'supertest'
// import {createServer} from 'node:http'
import { app } from '../src/app'



describe('Users Routes', () =>{

    beforeAll(async () =>{
        await app.ready()
    })
    
    afterAll(async () =>{
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new user', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name:"user"
            })
            .expect(201)
    })

    it('should be able to list all users', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name:"user"
            })
            .expect(201)

        const cookie = createUserResponse.get('Set-Cookie')

        if (cookie != null){
            const listUsersResponse = await request(app.server)
                .get('/users')
                .set('Cookie', cookie)
                .expect(200)

            // console.log(listUsersResponse.body)

            expect(listUsersResponse.body.users).toEqual([
                expect.objectContaining({
                    name:"user"
                })
            ])
        }

    })

    it('should be able to list user by ID', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name:"user"
            })
            .expect(201)

        const cookie = createUserResponse.get('Set-Cookie')

        if (cookie != null){
            
            const listUsersResponse = await request(app.server)
            .get('/users')
            .set('Cookie', cookie)
            .expect(200)
            
            const id = listUsersResponse.body.users[0].id

            const getUserResponse = await request(app.server)
                .get(`/users/${id}`)
                .set('Cookie', cookie)
                .expect(200)

            expect(getUserResponse.body.user).toEqual(
                expect.objectContaining({
                    name: "user"
                })
            )
        }

    })

})

describe('Meals Routes', () => {

    beforeAll(async () =>{
        await app.ready()
    })
    
    afterAll(async () =>{
        await app.close()
    })

    beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })

    it('should be able to create a new meal', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name:"user"
            })

        const cookie = createUserResponse.get('Set-Cookie')

        if (cookie != null){
            
            const listUsersResponse = await request(app.server)
            .get('/users')
            .set('Cookie', cookie)
            
            const id = listUsersResponse.body.users[0].id

            await request(app.server)
                .post('/meals')
                .set('Cookie', cookie)
                .send({
                    name: "name",
                    description: "description",
                    diet: true,
                    userId: id
                }).expect(200)

        }

    })
    it('should be able to list all meals, count and best sequence of diet', async () => {
        const createUserResponse = await request(app.server)
            .post('/users')
            .send({
                name:"user"
            })

        const cookie = createUserResponse.get('Set-Cookie')

        if (cookie != null){
            
            const listUsersResponse = await request(app.server)
            .get('/users')
            .set('Cookie', cookie)
            
            const id = listUsersResponse.body.users[0].id

            await request(app.server)
                .post('/meals')
                .set('Cookie', cookie)
                .send({
                    name: "meal1",
                    description: "description",
                    diet: false,
                    userId: id
                })

            await request(app.server)
            .post('/meals')
            .set('Cookie', cookie)
            .send({
                name: "meal2",
                description: "description",
                diet: true,
                userId: id
            })
            await request(app.server)
                .post('/meals')
                .set('Cookie', cookie)
                .send({
                    name: "meal3",
                    description: "description",
                    diet: true,
                    userId: id
                })

            const listMealsResponse = await request(app.server)
                .get('/meals')
                .set('Cookie', cookie)
                .expect(200)

            expect(listMealsResponse.body).toEqual(
                expect.objectContaining({
                    counterMeals: 3,
                    bestDiet: 2
                })
            )
        }

    })

})

