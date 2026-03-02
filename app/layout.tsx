import type { Metadata } from 'next'
import './styles/globals.css'
import { Playfair_Display, Nunito } from 'next/font/google'
import React from 'react'
import { ThemeProvider } from '@/app/context/theme-context'
import ConditionalHeader from '@/app/components/conditional-header'
import { SessionProvider } from 'next-auth/react'
import {auth} from "@/app/lib/auth";

const playfair = Playfair_Display({
    subsets:  ['latin', 'cyrillic'],
    weight:   ['600', '700', '800'],
    variable: '--font-display',
    display:  'swap',
})

const nunito = Nunito({
    subsets:  ['latin', 'cyrillic'],
    weight:   ['300', '400', '500', '600', '700'],
    variable: '--font-body',
    display:  'swap',
})

export const metadata: Metadata = {
    title:       'CityChe — єдине вікно для взаємодії з Черкасами',
    description: 'Офіційний вебпортал Черкаської міської громади.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()

    return (
        <html lang="uk" data-theme="dark" className={`${playfair.variable} ${nunito.variable}`}>
        <body>
        <SessionProvider session={session}>
            <ThemeProvider>
                <ConditionalHeader />
                {children}
            </ThemeProvider>
        </SessionProvider>
        </body>
        </html>
    )
}
