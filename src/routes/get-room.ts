import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function getRoom(app:FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get("/room/:roomTitle", {
        schema: {
            params: z.object({
                roomTitle: z.string()
            }),
        }
    }, async (request, reply) => {

        const roomTitle = request.params.roomTitle.toLowerCase()

        const foundRoom = await prisma.room.findFirst({
            where: {
                title: roomTitle
            }
        })

        if(!foundRoom) return reply.status(404).send({msg: "No room was found with the specified ID"})

        const registeredParticipants = await prisma.participants.findMany({
            where: {
                roomId: foundRoom.id
            }
        })

        const responseData = {
            id: foundRoom.id,
            title: foundRoom.title,
            maximumParticipants: foundRoom.maximumParticipants,
            currentNumberOfParticipants: registeredParticipants.length,
            currentParticipantList: registeredParticipants
        }

        return reply.status(200).send(responseData)
    })
}