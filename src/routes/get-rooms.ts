import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";


export async function getRooms(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/room", {}, async(request, reply) => {
        const rooms = await prisma.room.findMany({})

        if(!rooms) return reply.status(200).send({msg: "No rooms were found"})
        
        return reply.status(201).send(rooms)
    })
}