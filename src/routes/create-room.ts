import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import {z} from "zod"
import { generatePassword } from "../lib/room_password_generator"

export async function createRoom(app:FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post("/room", {
        schema: {
            summary: 'Create room',
            tags:['rooms'],
            body: z.object({
                title: z.string({ invalid_type_error: '"title" must be a string containing at least 4 characters'}).min(4),
                maximumAttendees: z.number().int().nullable(),
                organizerNickname: z.string({ invalid_type_error: '"organizerNickname" must be a string containing at least 4 characters'}).min(4),
                organizerPhoneNumber: z.string({ invalid_type_error: '"organizerPhoneNumber" must be a string containing at least 4 characters'}).min(4),
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

            let { title, maximumAttendees, organizerNickname, organizerPhoneNumber } = request.body
            title = title.toLowerCase()

            const existing_room = await prisma.room.findFirst({
                where: {
                    title: title
                }
            })

            if(existing_room) return reply.status(401).send({ msg: "A room with the specified name already exists"})


            const room_access_password = generatePassword()
            const administrator_password = generatePassword()
            
            const new_room = await prisma.room.create({
                data: {
                    title: title,
                    maximumParticipants: maximumAttendees ? maximumAttendees : null,
                    accessPassword: room_access_password,
                    adminPassword: administrator_password
                }
            })

            const organizerRegistrationAsParticipant = await prisma.participants.create({
                data: {
                    nickname: organizerNickname,
                    isOrganizer: true, 
                    phone_number: organizerPhoneNumber,
                    roomId: new_room.id
                }
            })

            return reply.status(201).send({ roomId: new_room.id})
        })
}