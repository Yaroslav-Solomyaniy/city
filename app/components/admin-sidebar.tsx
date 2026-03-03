// app/components/admin-sidebar.tsx

'use client'

import React, {useState, useEffect, useLayoutEffect} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/app/context/theme-context'
import {
    LayoutDashboard, FolderTree, Globe, Users,
    MessageSquare, Settings, ScrollText,
    ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react'
import AdminSidebarActions from '@/app/components/admin-sidebar-actions'

/* ─── Nav items ──────────────────────────────────────────────── */
const NAV_SECTIONS = [
    {
        title: 'Головне',
        items: [
            { href: '/admin',                label: 'Дашборд',        icon: LayoutDashboard },
            { href: '/admin/categories',     label: 'Категорії',      icon: FolderTree },
            { href: '/admin/resources',      label: 'Ресурси',        icon: Globe },
            { href: '/admin/administrators', label: 'Адміністратори', icon: Users },
        ],
    },
    {
        title: 'Інструменти',
        items: [
            { href: '/admin/feedback', label: 'Зворотній зв\'язок', icon: MessageSquare },
            { href: '/admin/settings', label: 'Налаштування',       icon: Settings },
            { href: '/admin/logs',     label: 'Логи дій',           icon: ScrollText },
        ],
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const { isDark, toggleTheme, mounted } = useTheme()
    const [collapsed, setCollapsed]   = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setMobileOpen(false), 0)
        return () => clearTimeout(t)
    }, [pathname])

    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)')
        const handler = () => { if (mq.matches) setMobileOpen(false) }
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

    /* ─── Sidebar content ────────────────────────────────────── */
    const sidebarContent = (
        <div className="flex flex-col h-full">

            {/* Logo */}
            <div className="px-4 pt-5 pb-4 flex items-center gap-3 shrink-0">
                <Link href="/" className="flex items-center gap-3 no-underline group">
                    <Image
                        src="/gerb.png"
                        width={32} height={32}
                        alt="Герб"
                        className="transition-transform duration-200 group-hover:scale-105"
                    />
                    {!collapsed && (
                        <div className="flex flex-col leading-tight">
                            <span className="font-bold text-[13px] whitespace-nowrap"
                                  style={{ color: 'var(--text-primary)' }}>
                                СітіЧЕ
                            </span>
                            <span className="text-[10px] font-semibold tracking-wider uppercase"
                                  style={{ color: 'var(--text-accent)' }}>
                                Адмін-панель
                            </span>
                        </div>
                    )}
                </Link>
            </div>

            <div className="mx-4 h-px" style={{ background: 'var(--border)' }} />

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {NAV_SECTIONS.map(section => (
                    <div key={section.title}>
                        {!collapsed && (
                            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.15em]"
                               style={{ color: 'var(--text-muted)' }}>
                                {section.title}
                            </p>
                        )}
                        <div className="flex flex-col gap-0.5">
                            {section.items.map(item => {
                                const active = isActive(item.href)
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={collapsed ? item.label : undefined}
                                        className={`
                                            flex items-center gap-3 rounded-xl text-[13.5px] font-semibold
                                            transition-all duration-150 no-underline
                                            ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                                        `}
                                        style={active
                                            ? {
                                                background: 'var(--admin-nav-active-bg)',
                                                color: 'var(--admin-nav-active-text)',
                                                boxShadow: 'var(--admin-nav-active-shadow)',
                                            }
                                            : { background: 'transparent', color: 'var(--text-secondary)' }
                                        }
                                        onMouseEnter={e => {
                                            if (!active) {
                                                (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'
                                                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!active) {
                                                (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                ;(e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'
                                            }
                                        }}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2 : 1.7} />
                                        {!collapsed && <span>{item.label}</span>}
                                        {active && !collapsed && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full"
                                                  style={{ background: 'var(--text-accent)' }} />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="mx-4 h-px" style={{ background: 'var(--border)' }} />

            {/* Bottom */}
            <div className="px-3 py-4 space-y-1 shrink-0">

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className={`
                        flex items-center gap-3 rounded-xl text-[13px] font-medium
                        transition-all duration-150 w-full
                        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                    `}
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                    {mounted && isDark ? (
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                        </svg>
                    )}
                    {!collapsed && <span>{isDark ? 'Світла тема' : 'Темна тема'}</span>}
                </button>

                {/* Collapse toggle (desktop only) */}
                <button
                    onClick={() => setCollapsed(c => !c)}
                    className={`
                        hidden lg:flex items-center gap-3 rounded-xl text-[13px] font-medium
                        transition-all duration-150 w-full
                        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                    `}
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                    {collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} /><span>Згорнути</span></>}
                </button>

                {/* Portal + Sign out */}
                <AdminSidebarActions collapsed={collapsed} />
            </div>
        </div>
    )

    return (
        <>
            {/* ══ DESKTOP SIDEBAR ══ */}
            <aside
                className="hidden lg:flex flex-col shrink-0 sticky top-0 h-screen transition-all duration-300 z-30"
                style={{
                    width: collapsed ? '72px' : '260px',
                    background: 'var(--admin-sidebar-bg)',
                    borderRight: '1px solid var(--admin-sidebar-border)',
                }}
            >
                {sidebarContent}
            </aside>

            {/* ══ MOBILE OVERLAY ══ */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40"
                    style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ══ MOBILE SIDEBAR ══ */}
            <aside
                className="lg:hidden fixed top-0 left-0 h-full z-50 flex flex-col transition-transform duration-300"
                style={{
                    width: '280px',
                    background: 'var(--admin-sidebar-bg)',
                    borderRight: '1px solid var(--admin-sidebar-border)',
                    transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
                }}
            >
                <button
                    onClick={() => setMobileOpen(false)}
                    className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                >
                    <X size={18} />
                </button>
                {sidebarContent}
            </aside>

            {/* ══ MOBILE TOP BAR ══ */}
            <div
                className="lg:hidden fixed top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 h-14"
                style={{
                    background: 'var(--admin-topbar-bg)',
                    borderBottom: '1px solid var(--admin-sidebar-border)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <button
                    onClick={() => setMobileOpen(true)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                >
                    <Menu size={20} />
                </button>
                <div className="flex items-center gap-2.5">
                    <Image src="/gerb.png" width={26} height={26} alt="Герб" />
                    <span className="font-bold text-[13px]" style={{ color: 'var(--text-primary)' }}>
                        Адмін-панель
                    </span>
                </div>
            </div>
        </>
    )
}