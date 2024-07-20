import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { drawParticipants } from "../lib/drawer" 
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function generateDraw(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/generate-draw/:roomId", {
        schema: {
            params: z.object({
                roomId: z.string().uuid()
            }),
        }}, async(request, reply) => {
            
            let {roomId} = request.params

            let roomDetails = await prisma.room.findFirst({
                where: {
                    id: roomId
                }
            })

            if(!roomDetails){
                return reply.status(404).send({message: "Specified room does not exist"})
            }

            let participantList = await prisma.participants.findMany({
                where: {
                    roomId: roomId
                }
            })


            if(participantList.length < 3) return reply.status(400).send({message: "Participants number should be at least 3"})

            const draw_result = drawParticipants(participantList)

            for(let participant in draw_result){
                await prisma.participants.update({
                    where: {
                        id: draw_result[participant].participantId
                    },
                    data: {
                        pair: draw_result[participant].pair
                    }
                })
            }
            
            return reply.status(200).send(draw_result)
        }
    )
}