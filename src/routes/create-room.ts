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
                    roomId: z.string().min(4),
                    })
                }
            }
        }, 
        async(request, reply) => {

            const { title, maximumAttendees } = request.body;

            
            const new_room = await prisma.room.create({
                data: {
                    title: title,
                    maximumParticipants: maximumAttendees ? maximumAttendees : null
                }
            })

            return reply.status(201).send({ roomId: new_room.title})
        })
}