'use client'

import { usePathname } from 'next/navigation'
import Header from '@/app/components/header'

export default function ConditionalHeader() {
    const pathname = usePathname()
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) return null
    return <Header />
}