// app/api/admin/register/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'
import { registerAdminSchema } from '@/app/lib/zod'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const parsed = registerAdminSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            )
        }

        const { token, name, password } = parsed.data

        // Перевіряємо токен
        const invite = await prisma.inviteToken.findUnique({ where: { token } })

        if (!invite) {
            return NextResponse.json({ error: 'Недійсне запрошення' }, { status: 404 })
        }

        if (invite.used) {
            return NextResponse.json({ error: 'Це запрошення вже використане' }, { status: 410 })
        }

        if (invite.expires < new Date()) {
            return NextResponse.json({ error: 'Термін дії запрошення минув' }, { status: 410 })
        }

        // Чи вже є юзер з таким email
        const existing = await prisma.user.findUnique({ where: { email: invite.email } })

        if (existing) {
            return NextResponse.json(
                { error: 'Адміністратор з таким email вже існує' },
                { status: 409 }
            )
        }

        const hashed = await bcrypt.hash(password, 12)

        // Створюємо юзера, помічаємо токен використаним, логуємо — в одній транзакції
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email:         invite.email,
                    name:          name?.trim() || null,
                    password:      hashed,
                    emailVerified: new Date(),
                },
            })

            await tx.inviteToken.update({
                where: { token },
                data:  { used: true },
            })

            await tx.activityLog.create({
                data: {
                    action:     'CREATE',
                    entity:     'ADMIN',
                    entityName: user.email,
                    details:    'Зареєстровано через запрошення',
                    userId:     invite.createdBy,
                },
            })
        })

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Помилка сервера' }, { status: 500 })
    }
}
