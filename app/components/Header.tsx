'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
    { href: '/',           label: 'Головна'   },
    { href: '/categories', label: 'Категорії' },
    { href: '/resources',  label: 'Ресурси'   },
    { href: '/about',      label: 'Про портал' },
]

export default function Header() {
    const pathname = usePathname()
    const [searchOpen,  setSearchOpen]  = useState(false)
    const [searchValue, setSearchValue] = useState('')
    const [scrolled,    setScrolled]    = useState(false)
    const [mobileOpen,  setMobileOpen]  = useState(false)
    const searchRef = useRef<HTMLInputElement>(null)

    // Світлі сторінки — хедер адаптується
    const lightPages = ['/categories', '/resources', '/contacts']
    const isLight = lightPages.some(p => pathname === p || pathname.startsWith(p + '/'))

    const pill = {
        bg:     isLight
            ? scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.88)'
            : scrolled ? 'rgba(8,14,36,0.92)'     : 'rgba(8,14,36,0.75)',
        border: isLight
            ? scrolled ? '1px solid rgba(0,0,0,0.10)' : '1px solid rgba(0,0,0,0.07)'
            : scrolled ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.07)',
        shadow: isLight
            ? scrolled ? '0 8px 40px rgba(0,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.04)' : '0 4px 24px rgba(0,0,0,0.08)'
            : scrolled ? '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)' : '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
    }

    const navActive   = isLight ? 'text-blue-600 bg-blue-50'         : 'text-white bg-white/10'
    const navInactive = isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
    const dotColor    = isLight ? 'bg-blue-500' : 'bg-blue-400'
    const searchColor = isLight ? 'text-slate-400 hover:text-slate-800' : 'text-slate-400 hover:text-white'
    const cityName    = isLight ? 'text-slate-800' : 'text-white'
    const kpName      = isLight ? 'text-slate-400' : 'text-slate-500'
    const dividerClr  = isLight ? 'bg-black/10' : 'bg-white/10'
    const burgerClr   = isLight ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/5'
    const searchBorder = isLight ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(96,165,250,0.35)'
    const searchBg     = isLight ? 'rgba(59,130,246,0.06)'          : 'rgba(255,255,255,0.08)'

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

    return (
        <div className="fixed top-0 left-0 right-0 z-40 px-4 pt-3 pb-1 pointer-events-none">
            <div
                className="pointer-events-auto max-w-7xl mx-auto rounded-2xl transition-all duration-300"
                style={{
                    background:           pill.bg,
                    backdropFilter:       'blur(20px) saturate(1.8)',
                    WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                    border:               pill.border,
                    boxShadow:            pill.shadow,
                    transition: 'all .3s cubic-bezier(.4,0,.2,1)',
                }}
            >
                {/* ════ MAIN ROW ════ */}
                <div className="h-16 flex items-center gap-3 px-5">

                    {/* ── [1] ЛІВО: герб + громада + КП ── */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="flex items-center gap-3 shrink-0 group"
                    >
                        <Image
                            src="/gerb.png"
                            width={36}
                            height={36}
                            alt="Герб Черкаської міської ради"
                            className="transition-transform duration-200 group-hover:scale-105"
                        />
                        <div className="flex flex-col leading-tight">
                            <span className={`font-bold text-[13.5px] whitespace-nowrap leading-snug transition-all duration-200 ${cityName} ${searchOpen ? 'hidden lg:block' : 'block'}`}>
                                Черкаська міська громада
                            </span>
                            <span className={`hidden lg:block text-[10.5px] whitespace-nowrap leading-snug ${kpName}`}>
                                КП «Інститут розвитку міста та цифрової трансформації» ЧМР
                            </span>
                        </div>
                    </Link>

                    {/* ── DIVIDER ── */}
                    <div className={`hidden lg:block h-7 w-px shrink-0 ${dividerClr}`} />

                    {/* ── [2] ЦЕНТР: навігація ── */}
                    <nav className="hidden md:flex items-center justify-center gap-0.5 flex-1">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                className={[
                                    'relative px-3.5 py-1.5 rounded-xl text-[13.5px] font-semibold',
                                    'transition-all duration-200 whitespace-nowrap',
                                    isActive(href) ? navActive : navInactive,
                                ].join(' ')}
                            >
                                {label}
                                {isActive(href) && (
                                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${dotColor}`} />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Мобільний spacer */}
                    <div className="flex-1 md:hidden" />

                    {/* ── [3] ПРАВО: пошук + divider + бренд + burger ── */}

                    {/* Пошук */}
                    <div
                        className="flex items-center overflow-hidden rounded-full transition-all duration-300"
                        style={{
                            width:      searchOpen ? '200px' : '34px',
                            background: searchOpen ? searchBg : 'transparent',
                            border:     searchOpen ? searchBorder : '1px solid transparent',
                        }}
                    >
                        <button
                            onClick={() => {
                                setSearchOpen(v => !v)
                                if (searchOpen) setSearchValue('')
                            }}
                            className={`w-[34px] h-[34px] flex items-center justify-center shrink-0 transition-colors ${searchColor}`}
                            aria-label="Пошук"
                        >
                            {searchOpen ? (
                                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                                    <path d="M1.5 1.5l10 10M11.5 1.5l-10 10" />
                                </svg>
                            ) : (
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="6.5" cy="6.5" r="4.2" />
                                    <path d="M10 10l2.8 2.8" />
                                </svg>
                            )}
                        </button>
                        <input
                            ref={searchRef}
                            type="text"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value)}
                            placeholder="Пошук..."
                            className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-500 outline-none pr-3 transition-opacity duration-200"
                            style={{ opacity: searchOpen ? 1 : 0 }}
                            onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                        />
                    </div>

                    {/* Divider перед брендом */}
                    <div className={`hidden xl:block h-7 w-px shrink-0 ${dividerClr}`} />

                    {/* Бренд порталу */}
                    <Link
                        href="/"
                        onClick={closeMenu}
                        className="hidden xl:flex items-center gap-2.5 shrink-0 group"
                    >
                        <div
                            className="h-7 px-3 rounded-lg flex items-center justify-center transition-opacity duration-200 group-hover:opacity-80"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                boxShadow:  '0 2px 10px rgba(99,102,241,0.35)',
                            }}
                        >
                            <span className="text-white font-black text-[11px] tracking-widest">
                                City-Che
                            </span>
                        </div>
                        <span className={`font-semibold text-[13.5px] whitespace-nowrap ${isLight ? 'text-slate-800' : 'text-white'}`}>
                            Громадський портал
                        </span>
                    </Link>

                    {/* Mobile burger */}
                    <button
                        className={`md:hidden w-8 h-8 flex items-center justify-center rounded-xl transition-all ${burgerClr}`}
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Меню"
                    >
                        {mobileOpen ? (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M2 2l12 12M14 2L2 14" />
                            </svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M2 4h12M2 8h12M2 12h12" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* ════ MOBILE DROPDOWN ════ */}
                <div
                    className="md:hidden overflow-hidden transition-all duration-300"
                    style={{
                        maxHeight: mobileOpen ? '340px' : '0',
                        borderTop: mobileOpen
                            ? `1px solid ${isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'}`
                            : 'none',
                    }}
                >
                    <div className="px-3 py-3 space-y-1">

                        {/* Бренд у мобільному меню */}
                        <div className="flex items-center gap-2.5 px-3.5 py-2 mb-1">
                            <div
                                className="h-6 px-2.5 rounded-md flex items-center"
                                style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                            >
                                <span className="text-white font-black text-[10px] tracking-widest">City-Che</span>
                            </div>
                            <span className={`font-semibold text-[13px] ${isLight ? 'text-slate-800' : 'text-white'}`}>
                                Громадський портал
                            </span>
                        </div>

                        {/* Мобільний пошук */}
                        <div
                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-1"
                            style={{
                                background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                                border: isLight ? '1px solid rgba(0,0,0,0.07)' : '1px solid rgba(255,255,255,0.07)',
                            }}
                        >
                            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="6.5" cy="6.5" r="4.2" />
                                <path d="M10 10l2.8 2.8" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Пошук по порталу..."
                                className={`flex-1 bg-transparent text-[13px] placeholder-slate-400 outline-none ${isLight ? 'text-slate-800' : 'text-white'}`}
                            />
                        </div>

                        {/* Навігація */}
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                onClick={closeMenu}
                                className={[
                                    'flex items-center px-3.5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all',
                                    isActive(href)
                                        ? isLight
                                            ? 'text-blue-600 bg-blue-50 border border-blue-100'
                                            : 'text-white bg-blue-600/15 border border-blue-500/20'
                                        : isLight
                                            ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5',
                                ].join(' ')}
                            >
                                {label}
                            </Link>
                        ))}

                        {/* КП підпис */}
                        <p className={`px-3.5 pt-2 pb-1 text-[10.5px] leading-relaxed border-t mt-1 ${isLight ? 'text-slate-400 border-black/5' : 'text-slate-600 border-white/5'}`}>
                            КП «Інститут розвитку міста» Черкаської міської ради
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}