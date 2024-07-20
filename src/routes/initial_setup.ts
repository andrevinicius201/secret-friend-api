import { prisma } from "../lib/prisma";

async function eraseTables(){
    const response = await Promise.all([
        prisma.room.deleteMany(),
        prisma.participants.deleteMany()
    ])

    return response
}


eraseTables().then(() => {
    console.log("Database erased")
    prisma.$disconnect()
})