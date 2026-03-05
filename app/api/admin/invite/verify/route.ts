import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

export async function GET(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
        return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 400 })
    }

    const invite = await prisma.inviteToken.findUnique({ where: { token } })

    if (!invite) {
        return NextResponse.json({ valid: false, reason: 'invalid' }, { status: 404 })
    }

    if (invite.used) {
        return NextResponse.json({ valid: false, reason: 'used' }, { status: 410 })
    }

    if (invite.expires < new Date()) {
        return NextResponse.json({ valid: false, reason: 'expired' }, { status: 410 })
    }

    return NextResponse.json({ valid: true, email: invite.email })
}
