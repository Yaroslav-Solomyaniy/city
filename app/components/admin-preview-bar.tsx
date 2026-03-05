// app/components/admin-preview-bar.tsx

'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { LayoutDashboard, LogOut, X } from 'lucide-react'
import { useState } from 'react'
import {usePathname} from "next/navigation";

export default function AdminPreviewBar() {
    const { data: session, status } = useSession()
    const pathname = usePathname()
    const [hidden, setHidden] = useState(false)

    if (status === 'loading' || !session || hidden || pathname.startsWith('/admin')) return null


    return (
        <div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg"
            style={{
                background: 'var(--admin-sidebar-bg)',
                border: '1px solid var(--admin-stat-border)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* Avatar */}
            <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
            >
                {(session.user?.name ?? session.user?.email ?? 'A')[0].toUpperCase()}
            </div>

            {/* Name */}
            <span className="text-[12.5px] font-semibold hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
                {session.user?.name ?? session.user?.email}
            </span>

            <div className="w-px h-4 mx-1" style={{ background: 'var(--border)' }} />

            {/* Back to admin */}
            <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150 no-underline"
                style={{
                    background: 'transparent',
                    color: 'var(--admin-nav-active-text)',
                    border: '1px solid var(--admin-nav-active-bg)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-active-bg)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
                <LayoutDashboard size={13} />
                <span>Адмін-панель</span>
            </Link>

            {/* Sign out */}
            <button
                onClick={() => signOut({ callbackUrl: '/auth/sign-in' })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-150"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--admin-danger-text)'
                }}
                onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                }}
            >
                <LogOut size={13} />
                <span className="hidden sm:block">Вийти</span>
            </button>

            {/* Hide bar */}
            <button
                onClick={() => setHidden(true)}
                className="w-6 h-6 flex items-center justify-center rounded-lg transition-colors ml-1"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                title="Сховати"
            >
                <X size={13} />
            </button>
        </div>
    )
}