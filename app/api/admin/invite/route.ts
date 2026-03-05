import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'
import nodemailer from 'nodemailer'
import { inviteAdminEmail } from "@/app/lib/email-template"

export async function POST(req: NextRequest) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Не авторизовано' }, { status: 401 })
    }

    const body = await req.json()
    const email: string = body.email?.trim().toLowerCase()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: 'Некоректний email' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ error: 'Адміністратор з таким email вже існує' }, { status: 409 })
    }

    const existingInvite = await prisma.inviteToken.findFirst({
        where: { email, used: false, expires: { gt: new Date() } },
    })

    if (existingInvite) {
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

    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000)
    const invite = await prisma.inviteToken.create({
        data: { email, expires, createdBy: session.user.id },
    })

    const link = buildLink(req, invite.token)

    // ── DEBUG: перевіряємо env ──
    console.log('[invite] EMAIL_SERVER_HOST:', process.env.EMAIL_SERVER_HOST)
    console.log('[invite] EMAIL_SERVER_PORT:', process.env.EMAIL_SERVER_PORT)
    console.log('[invite] EMAIL_SERVER_USER:', process.env.EMAIL_SERVER_USER)
    console.log('[invite] EMAIL_SERVER_PASSWORD:', process.env.EMAIL_SERVER_PASSWORD ? '✓ є' : '✗ ВІДСУТНІЙ')
    console.log('[invite] EMAIL_FROM:', process.env.EMAIL_FROM)
    console.log('[invite] to:', email)
    console.log('[invite] link:', link)

    try {
        await sendInviteEmail({
            to:        email,
            link,
            host:      req.nextUrl.hostname,
            invitedBy: session.user.name ?? session.user.email ?? undefined,
        })
        console.log('[invite] ✓ лист відправлено')
    } catch (err) {
        console.error('[invite] ✗ помилка відправки:', err)
        // Повертаємо invite попри помилку листа — токен вже створено
        return NextResponse.json({
            invite: {
                id:        invite.id,
                email:     invite.email,
                used:      invite.used,
                expires:   formatDate(invite.expires),
                createdAt: formatDate(invite.createdAt),
                link,
            },
            warning: 'Запрошення створено, але лист не надіслано. Скопіюй посилання вручну.',
        })
    }

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

/* ─── Email ──────────────────────────────────────────────────── */
async function sendInviteEmail({
                                   to, link, host, invitedBy,
                               }: {
    to: string
    link: string
    host: string
    invitedBy?: string
}) {
    const transport = nodemailer.createTransport({
        host:   process.env.EMAIL_SERVER_HOST,
        port:   Number(process.env.EMAIL_SERVER_PORT ?? 465),
        secure: Number(process.env.EMAIL_SERVER_PORT ?? 465) === 465,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
        },
    })

    // Перевіряємо підключення перед відправкою
    await transport.verify()
    console.log('[invite] ✓ SMTP підключення OK')

    const { subject, html, text } = inviteAdminEmail({ url: link, host, invitedBy })

    const info = await transport.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
        text,
    })

    console.log('[invite] messageId:', info.messageId)
    console.log('[invite] response:', info.response)
}

/* ─── Helpers ────────────────────────────────────────────────── */
function buildLink(req: NextRequest, token: string): string {
    return `${req.nextUrl.origin}/auth/register/${token}`
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}