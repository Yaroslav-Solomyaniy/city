// app/components/admin-sidebar-actions.tsx

'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { ExternalLink, LogOut } from 'lucide-react'

interface Props {
    collapsed: boolean
}

export default function AdminSidebarActions({ collapsed }: Props) {
    return (
        <>
            {/* Back to portal */}
            <Link
                href="/"
                className={`
                    flex items-center gap-3 rounded-xl text-[13px] font-medium
                    transition-all duration-150 no-underline
                    ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                `}
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
            >
                <ExternalLink size={17} />
                {!collapsed && <span>Переглянути сайт</span>}
            </Link>

            {/* Sign out */}
            <button
                onClick={() => signOut({ redirectTo: '/' })}
                className={`
                    flex items-center gap-3 rounded-xl text-[13px] font-medium
                    transition-all duration-150 w-full
                    ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                `}
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
                <LogOut size={17} />
                {!collapsed && <span>Вийти</span>}
            </button>
        </>
    )
}