const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function main () {
    await prisma.$connect()
    console.log("Database connection successful!")
    await prisma.$disconnect()
}

main().catch(async (e)=> {
    console.error("Database connection failed:", e.message)
    await prisma.$disconnect()
})
.finally(async ()=> {
    await prisma.$disconnect()
})