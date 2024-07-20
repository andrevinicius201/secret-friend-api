import fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifyCors from "@fastify/cors"

import { registerParticipant } from './routes/register-participant'
import { createRoom } from './routes/create-room'
import { generateDraw } from './routes/generate-room-draw'
import { getRooms } from './routes/get-rooms'
import { getRoom } from './routes/get-room'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
    origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(getRooms)
app.register(getRoom)
app.register(createRoom)
app.register(registerParticipant)
app.register(generateDraw)

app.listen({port:3333, host:'0.0.0.0'}).then(() => {
    console.log(`HTTP Server Running`)
})