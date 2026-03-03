// app/api/admin/invite/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function POST(req: NextRequest) {
    // Перевірка сесії — тільки авторизований адмін може запрошувати
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 })
    }

    const body = await req.json()
    const email: string = body.email?.trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Некоректний email' }, { status: 400 })
    }

    // Чи вже є такий юзер
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
        return NextResponse.json(
            { error: 'Адміністратор з таким email вже існує' },
            { status: 409 }
        )
    }

    // Чи є активне невикористане запрошення на цей email
    const existingInvite = await prisma.inviteToken.findFirst({
        where: {
            email,
            used: false,
            expires: { gt: new Date() },
        },
    })

    if (existingInvite) {
        // Повертаємо вже існуюче запрошення
        const link = buildLink(req, existingInvite.token)

        return NextResponse.json({
            invite: {
                id:        existingInvite.id,
                email:     existingInvite.email,
                used:      existingInvite.used,
                expires:   formatDate(existingInvite.expires),
                createdAt: formatDate(existingInvite.createdAt),
                link,
            },
        })
    }

    // Створюємо новий токен — діє 48 годин
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000)

    const invite = await prisma.inviteToken.create({
        data: {
            email,
            expires,
            createdBy: session.user.id,
        },
    })

    const link = buildLink(req, invite.token)

    // TODO: відправити email з посиланням (nodemailer)
    // await sendInviteEmail({ to: email, link })

    return NextResponse.json({
        invite: {
            id:        invite.id,
            email:     invite.email,
            used:      invite.used,
            expires:   formatDate(invite.expires),
            createdAt: formatDate(invite.createdAt),
            link,
        },
    })
}

/* ─── Helpers ────────────────────────────────────────────────── */
function buildLink(req: NextRequest, token: string): string {
    const origin = req.nextUrl.origin
    return `${origin}/auth/register/${token}`
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA', {
        day:   '2-digit',
        month: '2-digit',
        year:  'numeric',
    })
}
