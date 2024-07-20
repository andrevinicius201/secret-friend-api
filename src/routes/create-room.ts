import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {z} from "zod"

export async function createRoom(app:FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/room", {
        schema: {
            summary: 'Create room',
            tags:['rooms'],
            body: z.object({
                title: z.string({ invalid_type_error: 'Title must be a string containing at least 4 characters'}).min(4),
                maximumAttendees: z.number().int().nullable()
            }),
            response: {
                201: z.object({
                    roomId: z.string().min(4).nullish(),
                    msg: z.string().nullish()
                    })
                }
            }
        }, 
        
        async(request, reply) => {

            const title = request.body.title.toLowerCase()
            const maximumAttendees = request.body.maximumAttendees

            const existing_room = await prisma.room.findFirst({
                where: {
                    title: title
                }
            })

            if(existing_room) return reply.status(401).send({ msg: "A room with the specified name already exists"})

            
            const new_room = await prisma.room.create({
                data: {
                    title: title.toLowerCase(),
                    maximumParticipants: maximumAttendees ? maximumAttendees : null
                }
            })

            return reply.status(201).send({ roomId: new_room.id})
        })
}