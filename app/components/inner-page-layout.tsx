'use client'

/**
 * InnerPageLayout
 * ─────────────────────────────────────────────────────────────────
 * Shared layout for Categories & Resources pages:
 *   - Desktop  (≥ lg):  sticky sidebar on the right, search inside it
 *   - Tablet   (md–lg): bottom nav bar  with icons + labels
 *   - Mobile   (< md):  bottom nav bar  with icons only
 *
 * Props:
 *   sidebar   — content for the desktop right panel
 *   children  — main content area
 *   bottomNavItems — items for the bottom bar (mobile/tablet)
 *   stickyTop — top offset for sticky sidebar (default 88px)
 */

import React from 'react'

export interface BottomNavItem {
    key:    string
    icon:   React.ReactNode
    label:  string
    active: boolean
    onClick: () => void
}

interface Props {
    sidebar:        React.ReactNode
    children:       React.ReactNode
    bottomNavItems: BottomNavItem[]
    stickyTop?:     number
}

export default function InnerPageLayout({ sidebar, children, bottomNavItems, stickyTop = 88 }: Props) {
    return (
        <>
            {/* ── Page wrapper ── */}
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-5 pb-28 lg:pb-16 flex gap-6 items-start">

                {/* MAIN */}
                <div className="flex-1 min-w-0">{children}</div>

                {/* DESKTOP SIDEBAR */}
                <aside
                    className="w-[300px] xl:w-[320px] shrink-0 hidden lg:flex flex-col gap-4"
                    style={{ position: 'sticky', top: stickyTop }}
                >
                    {sidebar}
                </aside>
            </div>

            {/* ══════════════════════════════════════════
                BOTTOM NAV  —  mobile (icons) / tablet (icons + labels)
                Hidden on lg+
            ══════════════════════════════════════════ */}
            <nav
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center"
                style={{
                    background:   'var(--bottom-nav-bg)',
                    borderTop:    '1px solid var(--bottom-nav-border)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                }}
            >
                {bottomNavItems.map(item => (
                    <button
                        key={item.key}
                        onClick={item.onClick}
                        className="flex-1 flex flex-col items-center gap-0.5 py-3 transition-all duration-150"
                        style={{ color: item.active ? 'var(--bottom-nav-active)' : 'var(--bottom-nav-inactive)' }}
                    >
                        {/* icon */}
                        <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                        {/* label: shown on md+, hidden on < md */}
                        <span className="hidden md:block text-[11px] font-semibold leading-none mt-0.5">
                            {item.label}
                        </span>
                    </button>
                ))}
            </nav>
        </>
    )
}