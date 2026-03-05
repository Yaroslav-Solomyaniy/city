// prisma/seed.ts

import 'dotenv/config'
import { PrismaClient } from './src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function main() {
    const email = 'admin@cityche.ua'
    const password = 'Admin1234!'

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
        console.log(`✓ Seed-адмін вже існує: ${email}`)
        return
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.user.create({
        data: {
            name: 'Головний адмін',
            email,
            password: hashed,
            emailVerified: new Date(),
        },
    })

    console.log('✓ Seed-адмін створений')
    console.log(`  Email:    ${email}`)
    console.log(`  Пароль:   ${password}`)
    console.log('  Зміни пароль після першого входу!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })