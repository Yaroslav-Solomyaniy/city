'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {useTheme} from "@/app/context/theme-context";
import { NAV_LINKS } from '../constants/nav'


export default function Header() {
    const pathname    = usePathname()
    const { isDark, toggleTheme, mounted } = useTheme()

    const [searchOpen,  setSearchOpen]  = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [scrolled,    setScrolled]    = useState(false)
    const [mobileOpen,  setMobileOpen]  = useState(false)
    // Track hovered nav item to avoid direct DOM mutation
    const [hoveredNav, setHoveredNav]   = useState<string | null>(null)
    const [toggleHovered, setToggleHovered] = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    // На головній хедер прозорий, але поважає поточну тему
    const isHome    = pathname === '/'
    // forceDark тільки якщо на головній І темна тема
    const forceDark = isHome && (!mounted || isDark)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        if (searchOpen) searchRef.current?.focus()
    }, [searchOpen])

    const closeMenu = () => {
        setMobileOpen(false)
        setSearchOpen(false)
        setSearchValue('')
    }

    const isActive = (href: string) =>
        pathname === href || (href !== '/' && pathname.startsWith(href))

    // ── pill styles ──────────────────────────────────────────────
    // На головній: темна тема → темний хедер поверх нічного фото
    //              світла тема → світлий хедер поверх денного фото
    const pillBg = isHome
        ? (forceDark
            ? (scrolled ? 'rgba(8,14,36,0.95)' : 'rgba(8,14,36,0.78)')
            : (scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.85)'))
        : (scrolled ? 'var(--header-bg-scroll)' : 'var(--header-bg)')
    const pillBorder = isHome
        ? (forceDark
            ? (scrolled ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.07)')
            : (scrolled ? 'rgba(0,0,0,0.10)' : 'rgba(0,0,0,0.07)'))
        : (scrolled ? 'var(--header-border-scroll)' : 'var(--header-border)')
    const pillShadow = isHome
        ? (forceDark
            ? (scrolled ? '0 8px 40px rgba(0,0,0,0.55)' : '0 4px 24px rgba(0,0,0,0.35)')
            : (scrolled ? '0 8px 40px rgba(0,0,0,0.12)' : '0 4px 20px rgba(0,0,0,0.08)'))
        : (scrolled ? 'var(--header-shadow-scroll)' : 'var(--header-shadow)')

    // ── css var helper ───────────────────────────────────────────
    // forceDark = homepage + dark theme → використовуємо хардкодні темні значення
    // homepage + light theme → хардкодні світлі значення
    // інші сторінки → CSS змінні
    const v = (darkVal: string, varName: string, lightVal?: string) => {
        if (!isHome) return `var(${varName})`
        return forceDark ? darkVal : (lightVal ?? `var(${varName})`)
    }

    // ── nav item style ───────────────────────────────────────────
    const navItemStyle = (href: string): React.CSSProperties => {
        const active  = isActive(href)
        const hovered = hoveredNav === href && !active
        if (active) return {
            background: forceDark ? 'rgba(255,255,255,0.1)' : (isHome ? 'rgba(37,99,235,0.1)' : 'var(--nav-active-bg)'),
            color:      forceDark ? '#fff' : (isHome ? '#1d4ed8' : 'var(--nav-active-text)'),
        }
        if (hovered) return {
            background: forceDark ? 'rgba(255,255,255,0.05)' : (isHome ? '#f1f5f9' : 'var(--nav-inactive-hover-bg)'),
            color:      forceDark ? '#fff' : (isHome ? '#0f172a' : 'var(--nav-inactive-hover-text)'),
        }
        return {
            background: 'transparent',
            color:      forceDark ? '#94a3b8' : (isHome ? '#374151' : 'var(--nav-inactive-text)'),
        }
    }

    const toggleStyle: React.CSSProperties = toggleHovered
        ? { color: forceDark ? '#f1f5f9' : (isHome ? '#0f172a' : 'var(--toggle-hover-icon)'), background: forceDark ? 'rgba(255,255,255,0.07)' : (isHome ? '#f1f5f9' : 'var(--toggle-hover-bg)') }
        : { color: forceDark ? '#94a3b8' : (isHome ? '#4b5563' : 'var(--toggle-icon)'), background: 'transparent' }

    return (
        <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-1 pointer-events-none">
            <div
                className="pointer-events-auto max-w-7xl mx-auto rounded-2xl"
                style={{
                    background:           pillBg,
                    backdropFilter:       'blur(16px) saturate(1.6)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
                    border:               `1px solid ${pillBorder}`,
                    boxShadow:            pillShadow,
                    transition: 'background .3s, border-color .3s, box-shadow .3s',
                    contain: 'layout',
                }}
            >
                {/* ════ MAIN ROW ════ */}
                <div className="h-16 flex items-center gap-3 px-5">

                    {/* Герб + громада */}
                    <Link href="/" onClick={closeMenu} className="flex items-center gap-3 shrink-0 group">
                        <Image
                            src="/gerb.png"
                            width={36} height={36}
                            alt="Герб Черкаської міської ради"
                            className="hidden htransition-transform duration-200 group-hover:scale-105 lg:block"
                        />
                        <Image
                            src="/Cherkasy_Color_Mini.png"
                            width={150} height={48}
                            alt="Герб"
                            className="block transition-transform duration-200 group-hover:scale-105 border-4 lg:hidden"
                        />
                        <div className="hidden md:flex flex-col leading-tight">
                            <span
                                className={`font-bold text-[13.5px] whitespace-nowrap leading-snug transition-all duration-200 ${searchOpen ? 'hidden lg:block' : 'block'}`}
                                style={{ color: v('#f1f5f9', '--city-name', '#111827') }}
                            >
                                СітіЧЕ - Черкаська міська громада
                            </span>
                            <span
                                className="hidden lg:block text-[10.5px] whitespace-nowrap leading-snug"
                                style={{ color: v('#475569', '--kp-name', '#6b7280') }}
                            >
                                КП «Інститут розвитку міста та цифрової трансформації» ЧМР
                            </span>
                        </div>
                    </Link>

                    <div className="hidden lg:block h-7 w-px shrink-0" style={{ background: v('rgba(255,255,255,0.08)', '--divider') }} />

                    {/* NAV */}
                    <nav className="hidden md:flex items-center justify-center gap-0.5 flex-1">
                        {NAV_LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                onMouseEnter={() => setHoveredNav(href)}
                                onMouseLeave={() => setHoveredNav(null)}
                                className="relative px-3.5 py-1.5 rounded-xl text-[13.5px] font-semibold transition-all duration-200 whitespace-nowrap"
                                style={navItemStyle(href)}
                            >
                                {label}
                                {isActive(href) && (
                                    <span
                                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                        style={{ background: v('#60a5fa', '--nav-dot', '#2563eb') }}
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex-1 md:hidden" />

                    <div className="hidden xl:block h-7 w-px shrink-0" style={{ background: v('rgba(255,255,255,0.08)', '--divider') }} />

                    {/* Пошук — на десктопі розширюється inline, на мобайлі тільки іконка */}
                    <div
                        className="hidden md:flex items-center overflow-hidden rounded-full transition-all duration-300"
                        style={{
                            width:      searchOpen ? '200px' : '34px',
                            background: searchOpen ? v('rgba(255,255,255,0.08)', '--search-input-bg') : 'transparent',
                            border:     searchOpen
                                ? `1px solid ${v('rgba(96,165,250,0.35)', '--search-input-border')}`
                                : '1px solid transparent',
                        }}
                    >
                        <button
                            onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchValue('') }}
                            className="w-[34px] h-[34px] flex items-center justify-center shrink-0 transition-colors"
                            style={{ color: v('#94a3b8', '--search-icon', '#6b7280') }}
                            aria-label="Пошук"
                        >
                            {searchOpen ? (
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <path d="M1.5 1.5l10 10M11.5 1.5l-10 10"/>
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="6.5" cy="6.5" r="4.2"/>
                                    <path d="M10 10l2.8 2.8"/>
                                </svg>
                            )}
                        </button>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Пошук..."
                            className="flex-1 bg-transparent text-[13px] placeholder-slate-500 outline-none pr-3"
                            style={{
                                opacity:    searchOpen ? 1 : 0,
                                color:      v('#f1f5f9', '--search-input-text'),
                                transition: 'opacity .2s',
                            }}
                            onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                        />
                    </div>

                    {/* Пошук на мобайлі — тільки іконка, відкриває рядок нижче */}
                    <button
                        onClick={() => { setSearchOpen(o => !o); if (searchOpen) setSearchValue('') }}
                        className="md:hidden w-[34px] h-[34px] flex items-center justify-center shrink-0 transition-colors rounded-xl"
                        style={{ color: v('#94a3b8', '--search-icon', '#6b7280') }}
                        aria-label="Пошук"
                    >
                        {searchOpen ? (
                            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                <path d="M1.5 1.5l10 10M11.5 1.5l-10 10"/>
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="6.5" cy="6.5" r="4.2"/>
                                <path d="M10 10l2.8 2.8"/>
                            </svg>
                        )}
                    </button>

                    {/* Theme toggle */}
                    <button
                        onClick={toggleTheme}
                        onMouseEnter={() => setToggleHovered(true)}
                        onMouseLeave={() => setToggleHovered(false)}
                        className="w-[34px] h-[34px] flex items-center justify-center rounded-xl transition-all duration-200"
                        style={toggleStyle}
                        aria-label="Перемкнути тему"
                        title="Перемкнути тему"
                        suppressHydrationWarning
                    >
                        {/* Render consistent icon on server; swap after mount to avoid hydration mismatch */}
                        {!mounted ? (
                            // Neutral placeholder — same on server and client first render
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"/>
                                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                            </svg>
                        ) : isDark ? (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                            </svg>
                        ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                            </svg>
                        )}
                    </button>


                    {/* Burger */}
                    <button
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                        style={{ color: v('#94a3b8', '--burger-text', '#4b5563') }}
                        onClick={() => setMobileOpen(o => !o)}
                        aria-label="Меню"
                    >
                        {mobileOpen ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M2 2l12 12M14 2L2 14"/>
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M2 4h12M2 8h12M2 12h12"/>
                            </svg>
                        )}
                    </button>
                </div>

                {/* ════ MOBILE SEARCH ROW ════ */}
                <div
                    className="md:hidden overflow-hidden transition-all duration-300"
                    style={{
                        maxHeight: searchOpen && !mobileOpen ? '60px' : '0',
                        borderTop: searchOpen && !mobileOpen ? `1px solid ${v('rgba(255,255,255,0.06)', '--mobile-border')}` : 'none',
                    }}
                >
                    <div className="px-4 py-2.5 flex items-center gap-2"
                         style={{
                             background: v('rgba(255,255,255,0.04)', '--mobile-input-bg'),
                         }}
                    >
                        <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="6.5" cy="6.5" r="4.2"/>
                            <path d="M10 10l2.8 2.8"/>
                        </svg>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Пошук по порталу..."
                            className="flex-1 bg-transparent text-[14px] placeholder-slate-500 outline-none"
                            style={{ color: v('#f1f5f9', '--search-input-text') }}
                            onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                        />
                    </div>
                </div>

                {/* ════ MOBILE DROPDOWN ════ */}
                <div
                    className="md:hidden overflow-hidden transition-all duration-300"
                    style={{
                        maxHeight: mobileOpen ? '360px' : '0',
                        borderTop: mobileOpen ? `1px solid ${v('rgba(255,255,255,0.06)', '--mobile-border')}` : 'none',
                    }}
                >
                    <div className="px-3 py-3 space-y-1">
                        <div className="flex items-center gap-2.5 px-3.5 py-2 mb-1">
                            <span className="font-semibold text-[13px]" style={{ color: v('#fff', '--brand-text', '#111827') }}>
                                Громадський портал Черкас
                            </span>
                        </div>

                        <div
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1"
                            style={{
                                background: v('rgba(255,255,255,0.05)', '--mobile-input-bg'),
                                border:     `1px solid ${v('rgba(255,255,255,0.08)', '--mobile-input-border')}`,
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="6.5" cy="6.5" r="4.2"/>
                                <path d="M10 10l2.8 2.8"/>
                            </svg>
                            <input
                                type="text"
                                placeholder="Пошук по порталу..."
                                className="flex-1 bg-transparent text-[13px] placeholder-slate-400 outline-none"
                                style={{ color: v('#f1f5f9', '--search-input-text') }}
                            />
                        </div>

                        {NAV_LINKS.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                className="flex items-center px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all"
                                style={isActive(href)
                                    ? {
                                        background: forceDark ? 'rgba(59,130,246,0.15)' : 'var(--sidebar-item-active-bg)',
                                        border:     `1px solid ${forceDark ? 'rgba(59,130,246,0.3)' : 'var(--sidebar-item-active-border)'}`,
                                        color:      forceDark ? '#fff' : 'var(--sidebar-item-active-text)',
                                    }
                                    : {
                                        border: '1px solid transparent',
                                        color:  forceDark ? '#94a3b8' : 'var(--sidebar-item-inactive-text)',
                                    }
                                }
                            >
                                {label}
                            </Link>
                        ))}

                        <p
                            className="px-3.5 pt-2 pb-1 text-[10.5px] leading-relaxed border-t mt-1"
                            style={{ color: v('#475569', '--text-muted'), borderColor: v('rgba(255,255,255,0.05)', '--mobile-border') }}
                        >
                            КП «Інститут розвитку міста» Черкаської міської ради
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}