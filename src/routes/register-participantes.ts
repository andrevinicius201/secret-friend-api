import { string } from 'zod'
import { prisma } from '../lib/prisma'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function registerParticipant(app:FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/register/:eventId", 
        // {
        // schema: {
        //     summary: 'Allows user registration to room',
        //     tags:['rooms'],
        //     body: z.object({
        //         name: z.string().min(4),
        //         email: z.string().email(),
        //     }),
        //     params: z.object({
        //         eventId: z.string().uuid()
        //     }),
        //     response: {
        //         201: z.object({
        //             attendeeId: z.number()
        //         })
        //     }
        // }}, 
        async (request, reply) => {

            const eventId = "temp"

            const [requestedRoom, eventParticipantsCounter] = await Promise.all([
                prisma.room.findFirst({
                    where: {
                        id:eventId
                    }
                }),
                prisma.participants.count({
                    where: {
                        roomId: eventId
                    }
                })
            ])
            
            if(!requestedRoom) return reply.status(404).send({msg: `Event was not found`})
            
            if(requestedRoom?.maximumParticipants && eventParticipantsCounter >= requestedRoom.maximumParticipants){
                return reply.status(401).send({msg: `This event is no longer available for registrations`})
            }

            const user_data = {
                nickname: "andrevinicius",
                phone_number: "+5511953534343",
                roomId: requestedRoom.id
            }
            const registered_user = await prisma.participants.create({
                data:user_data
            })
            return reply.send(`New participant registered to event ${requestedRoom.title}: ${registered_user.nickname}`)
    })
}