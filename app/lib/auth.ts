// app/lib/auth.ts

import NextAuth from 'next-auth'
import Credentials from '@auth/core/providers/credentials'
import bcrypt from 'bcrypt'
import prisma from '@/app/lib/prisma'
import { signInSchema } from '@/app/lib/zod'

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: {
        strategy: 'jwt',
    },

    pages: {
        signIn: '/auth/sign-in',
    },

    providers: [
        Credentials({
            name: 'Email і пароль',
            credentials: {
                email:    { label: 'Email',  type: 'email' },
                password: { label: 'Пароль', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    const { email, password } = await signInSchema.parseAsync(credentials)

                    const user = await prisma.user.findUnique({ where: { email } })

                    if (!user || !user.password) return null

                    const isValid = await bcrypt.compare(password, user.password)

                    if (!isValid) return null

                    return {
                        id:    user.id,
                        email: user.email,
                        name:  user.name ?? null,
                    }
                } catch {
                    return null
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },

        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
            }
            return session
        },
    },
})