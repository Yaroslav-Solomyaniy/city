// app/api/admin/register/route.ts

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const { token, name, password } = body

    if (!token || !password) {
        return NextResponse.json({ error: 'Не всі поля заповнені' }, { status: 400 })
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'Пароль має бути не менше 8 символів' }, { status: 400 })
    }

    if (password.length > 32) {
        return NextResponse.json({ error: 'Пароль має бути не більше 32 символів' }, { status: 400 })
    }

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
        return NextResponse.json({ error: 'Адміністратор з таким email вже існує' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)

    // Створюємо юзера і помічаємо токен використаним — в одній транзакції
    await prisma.$transaction([
        prisma.user.create({
            data: {
                email:         invite.email,
                name:          name?.trim() || null,
                password:      hashed,
                emailVerified: new Date(),
            },
        }),
        prisma.inviteToken.update({
            where: { token },
            data:  { used: true },
        }),
    ])

    return NextResponse.json({ success: true })
}