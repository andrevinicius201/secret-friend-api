import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export async function createRoom(app:FastifyInstance){
    app.post("/room", async(request, reply) => {

        const title = "Mocked room title"
        
        const new_room = await prisma.room.create({
            data: {
                title: title
            }
        })

        return reply.status(201).send({ result: new_room.title})
    })
}