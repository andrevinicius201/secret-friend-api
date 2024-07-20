import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function registerParticipant (app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/register/:roomId", {
        schema: {
            summary: 'Register participant',
            tags:['participant_registration'],
            body: z.object({
                nickName: z.string({ invalid_type_error: 'Participant must be a string containing at least 4 characters'}).min(4),
                phone_number: z.string({ invalid_type_error: 'RoomId must be a string containing at least 4 characters'}).min(4),
            }),
            
            params: z.object({
                roomId: z.string({ invalid_type_error: 'RoomId must be a string containing at least 4 characters'}).min(4)
            }),
            response: {
                201: z.object({
                    message: z.string()
                    })
                }
        }
    },  async(request, reply) => {

        const {nickName, phone_number} = request.body
        const roomId = request.params.roomId

        const [room, currentNumberOfParticipants] = await Promise.all([
            prisma.room.findUnique({
                where: {
                    id: roomId
                }
            }),
            prisma.participants.count({
                where: {
                    roomId: roomId,
                }
            })
        ])


        if(!room) return reply.status(404).send({message: "Specified room does not exist"})

        if(room?.maximumParticipants && currentNumberOfParticipants >= room.maximumParticipants){
            return reply.status(401).send({message: "This room is no longer available for new participants"})
        }
        
        const response = await prisma.participants.create({
            data: {
              nickname: nickName,
              phone_number: phone_number,
              roomId: roomId
            }
        })

        return reply.status(201).send({message: "User registered successfully"})
    })
}