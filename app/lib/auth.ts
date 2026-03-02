import {PrismaAdapter} from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Nodemailer from "@auth/core/providers/nodemailer";
import {magicLinkEmail} from "@/app/lib/email-template";
import prisma from "@/app/lib/prisma";


export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),

    session: {
        strategy: 'database',
    },

    pages: {
        signIn:        '/auth/sign-in',
        verifyRequest: '/auth/verify',
    },

    providers: [
        Nodemailer({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: Number(process.env.EMAIL_SERVER_PORT),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            async sendVerificationRequest({ identifier, url, provider }) {
                const { host } = new URL(url)
                const nodemailer = await import('nodemailer')
                const transport = nodemailer.createTransport(provider.server)
                const { subject, html, text } = magicLinkEmail({ url, host })

                await transport.sendMail({
                    to: identifier,
                    from: provider.from,
                    subject,
                    text,
                    html,
                })
            },
        }),
    ],

    callbacks: {
        async session({ session, user }) {
            if (user) {
                session.user.id   = user.id
                session.user.role = (user).role
            }
            return session
        },
    },
})
