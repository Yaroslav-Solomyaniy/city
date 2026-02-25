import type { Metadata } from 'next'
import Header from "@/app/components/Header";
import './styles/globals.css'

export const metadata: Metadata = {
    title: 'Громадський Портал | Черкаська Громада',
    description: 'Офіційний вебпортал Черкаської міської громади — єдине вікно до муніципальних послуг та інформації.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="uk">
        <body>
        <Header />
        {children}
        </body>
        </html>
    )
}