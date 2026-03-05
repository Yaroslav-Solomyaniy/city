// app/actions/admin/administrators/get-admins.ts
'use server'

import { auth } from '@/app/lib/auth'
import prisma from '@/app/lib/prisma'

export async function getAdministrators() {
    const session = await auth()

    if (!session?.user?.id) {
        throw new Error('Не авторизовано')
    }

    const [admins, invites] = await Promise.all([
        prisma.user.findMany({
            select: {
                id:          true,
                name:        true,
                email:       true,
                image:       true,
                lastSeenAt:  true,
                createdAt:   true,
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.inviteToken.findMany({
            where: {
                used:    false,
                expires: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    return {
        admins,
        invites: invites.map(i => ({
            ...i,
            link:      `${process.env.NEXTAUTH_URL}/auth/register/${i.token}`,
            expires:   i.expires.toLocaleDateString('uk-UA'),
            createdAt: i.createdAt.toLocaleDateString('uk-UA'),
        })),
    }
}