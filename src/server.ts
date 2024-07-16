import fastify from 'fastify'
import { registerParticipant } from './routes/register-participant'
import { createRoom } from './routes/create-room'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createRoom)
app.register(registerParticipant)

app.listen({port:3333, host:'0.0.0.0'}).then(() => {
    console.log(`HTTP Server Running`)
})

// async function getTestData(){
//     const data = await prisma.room.findMany({})
//     return data
//     if(data == null){
//         console.log("Não retornou nada")
//     } else {
//         console.log(data)
//         console.log("Retornou algo")
//     }
// }


// async function createRoom(){
//     const new_room = await prisma.room.create({
//         data: {
//             title: "Hello World"
//         }
//     })

//     return "ok"
// }


// let adicionando = await createRoom()
// console.log(adicionando)