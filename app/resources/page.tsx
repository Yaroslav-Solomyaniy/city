'use client'

import Link from 'next/link'
import React, { useState, useMemo, useEffect } from 'react'
import {
    Hospital, Users, Shield, Building2, Bus,
    GraduationCap, Zap, ExternalLink, Search,
    Clock,
    X,
} from 'lucide-react'
import InnerPageLayout, {BottomNavItem} from "@/app/components/inner-page-layout";
import { DEFAULT_VIEW, VIEW_OPTIONS, ViewMode } from '../constants/view-mode';

/* ─── Data ──────────────────────────────────────────────────────── */
interface Resource {
    id: string; title: string; titleEn: string
    description: string; url: string
    category: string; categorySlug: string
    icon: React.ElementType; accent: string; bg: string
    addedAt: string; isNew?: boolean
}

const RESOURCES: Resource[] = [
    { id: 'city-council',     title: 'Черкаська міська рада',                titleEn: 'City Council',       description: 'Рішення, розпорядження, новини та контакти депутатів міської ради.',          url: 'https://rada.cherkasy.ua',       category: 'Міська рада',       categorySlug: 'council',   icon: Building2,     accent: '#f59e0b', bg: '#fffbeb', addedAt: '2025-02-10', isNew: true },
    { id: 'oblast-hospital',  title: 'Черкаська обласна лікарня',            titleEn: 'Regional Hospital',  description: 'Запис на прийом, відділення та графік роботи лікарів.',                        url: 'https://obllikarna.ck.ua',       category: 'Лікарні',           categorySlug: 'hospitals', icon: Hospital,      accent: '#ef4444', bg: '#fef2f2', addedAt: '2025-02-08', isNew: true },
    { id: 'electrotrans',     title: 'Черкасиелектротранс',                  titleEn: 'Electrotrans',       description: 'Розклад трамваїв і тролейбусів, маршрути та зупинки.',                        url: 'https://electrotrans.ck.ua',     category: 'Транспорт',         categorySlug: 'transport', icon: Bus,           accent: '#f97316', bg: '#fff7ed', addedAt: '2025-02-05', isNew: true },
    { id: 'social',           title: 'Управління соціального захисту',       titleEn: 'Social Protection',  description: 'Субсидії, пільги, допомога при народженні дитини та виплати для ВПО.',        url: 'https://social.cherkasy.ua',     category: 'Соціальні питання', categorySlug: 'social',    icon: Users,         accent: '#8b5cf6', bg: '#f5f3ff', addedAt: '2025-02-01' },
    { id: 'safety',           title: 'Черкаський центр безпеки',             titleEn: 'Safety Center',      description: 'Гаряча лінія, оперативна обстановка, контакти служб порятунку та поліції.',  url: 'https://safety.cherkasy.ua',     category: 'Безпека',           categorySlug: 'safety',    icon: Shield,        accent: '#dc2626', bg: '#fef2f2', addedAt: '2025-01-28' },
    { id: 'children-hospital',title: 'Черкаська дитяча лікарня',             titleEn: "Children's Hospital",description: 'Педіатричні послуги, планові щеплення та довідки для школи.',                url: 'https://dytlikar.ck.ua',         category: 'Лікарні',           categorySlug: 'hospitals', icon: Hospital,      accent: '#ef4444', bg: '#fef2f2', addedAt: '2025-01-20' },
    { id: 'education',        title: 'Відділ освіти міськради',               titleEn: 'Education Dept.',    description: 'Запис у школи та дитячі садки, НМТ, шкільні округи, гранти для педагогів.',  url: 'https://osvita.cherkasy.ua',     category: 'Освіта',            categorySlug: 'education', icon: GraduationCap, accent: '#3b82f6', bg: '#eff6ff', addedAt: '2025-01-15' },
    { id: 'gaz',              title: 'Черкасигаз — особистий кабінет',       titleEn: 'Gas Provider',       description: 'Передача показань лічильника, оплата газу та заявки на обслуговування.',     url: 'https://cherkasygaz.ua',         category: 'Комунальні послуги',categorySlug: 'utilities', icon: Zap,           accent: '#10b981', bg: '#ecfdf5', addedAt: '2025-01-10' },
    { id: 'pension',          title: 'Пенсійний фонд — Черкаське управління',titleEn: 'Pension Fund',       description: 'Призначення пенсій, виплати, перерахунки та е-кабінет застрахованої особи.', url: 'https://pfu.gov.ua/cherkasy',    category: 'Соціальні питання', categorySlug: 'social',    icon: Users,         accent: '#8b5cf6', bg: '#f5f3ff', addedAt: '2025-01-05' },
    { id: 'vodokanal',        title: 'Водоканал Черкаси',                    titleEn: 'Water Supply',       description: 'Особистий кабінет, тарифи, аварійна служба та якість питної води.',           url: 'https://vodokanal.ck.ua',        category: 'Комунальні послуги',categorySlug: 'utilities', icon: Zap,           accent: '#10b981', bg: '#ecfdf5', addedAt: '2024-12-28' },
    { id: 'police',           title: 'Поліція Черкащини',                    titleEn: 'Cherkasy Police',    description: 'Звернення онлайн, гаряча лінія та профілактика злочинності.',                 url: 'https://ck.npu.gov.ua',          category: 'Безпека',           categorySlug: 'safety',    icon: Shield,        accent: '#dc2626', bg: '#fef2f2', addedAt: '2024-12-20' },
    { id: 'bus',              title: 'Маршрутки Черкас — розклад',           titleEn: 'Bus Schedule',       description: 'Актуальний розклад приміських та міських маршрутів, онлайн-квитки.',          url: 'https://bus.cherkasy.ua',        category: 'Транспорт',         categorySlug: 'transport', icon: Bus,           accent: '#f97316', bg: '#fff7ed', addedAt: '2024-12-15' },
]

const CATS = [
    { label: 'Всі',              slug: 'all'      },
    { label: 'Лікарні',          slug: 'hospitals'},
    { label: 'Соціальні питання',slug: 'social'   },
    { label: 'Безпека',          slug: 'safety'   },
    { label: 'Міська рада',      slug: 'council'  },
    { label: 'Транспорт',        slug: 'transport'},
    { label: 'Освіта',           slug: 'education'},
    { label: 'Комунальні послуги',slug:'utilities' },
]


/* ─── Page ─────────────────────────────────────────────────────── */
export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch]   = useState('')
    const [view,   setView]     = useState<ViewMode>(DEFAULT_VIEW)
    const [recentModal, setRecentModal] = useState(false)

    useEffect(() => {
        document.body.style.overflow = recentModal ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [recentModal])

    const filtered = useMemo(() =>
        RESOURCES.filter(r => {
            const matchCat = activeCategory === 'all' || r.categorySlug === activeCategory
            const q = search.toLowerCase()
            const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
            return matchCat && matchSearch
        }), [activeCategory, search])

    const recentlyAdded = useMemo(() =>
        [...RESOURCES].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()).slice(0, 8), [])

    /* bottom nav */
    const bottomNavItems: BottomNavItem[] = [
        ...VIEW_OPTIONS.map(v => ({
            key: v.mode, icon: <v.icon size={18}/>, label: v.label,
            active: view === v.mode, onClick: () => setView(v.mode),
        })),
        {
            key: 'recent', icon: <Clock size={18}/>, label: 'Нещодавні',
            active: recentModal, onClick: () => setRecentModal(true),
        },
    ]

    /* sidebar */
    const sidebar = (
        <>
            {/* Search in sidebar */}
            <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                style={{ background: 'var(--about-input-bg)', border: '1px solid var(--about-input-border)' }}
            >
                <Search size={15} style={{ color: 'var(--about-label)', flexShrink: 0 }}/>
                <input
                    type="text"
                    placeholder="Пошук ресурсів..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[color:var(--about-muted)]"
                    style={{ color: 'var(--about-text)', fontFamily: 'var(--font-body)' }}
                />
                {search && (
                    <button onClick={() => setSearch('')} style={{ color: 'var(--about-muted)' }}>
                        <X size={14}/>
                    </button>
                )}
            </div>

            {/* View toggle */}
            <div
                className="flex items-center gap-1 rounded-xl p-1"
                style={{ background: 'var(--about-card-bg)', border: '1px solid var(--about-card-border)' }}
            >
                {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => setView(mode)}
                        className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150"
                        style={view === mode
                            ? { background: 'rgba(59,130,246,0.18)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                            : { background: 'transparent', color: 'var(--about-muted)' }
                        }
                    >
                        <Icon size={14}/> {label}
                    </button>
                ))}
            </div>

            {/* Category filters */}
            <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--about-card-bg)', border: '1px solid var(--about-card-border)' }}
            >
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4">Категорії</p>
                <div className="flex flex-col gap-1">
                    {CATS.map(cat => (
                        <button
                            key={cat.slug}
                            onClick={() => setActiveCategory(cat.slug)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-left transition-all duration-150"
                            style={activeCategory === cat.slug
                                ? { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' }
                                : { background: 'transparent', color: 'var(--about-muted)', border: '1px solid transparent' }
                            }
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0"/>
                            {cat.label}
                            <span className="ml-auto text-[11px] font-semibold opacity-60">
                                {cat.slug === 'all' ? RESOURCES.length : RESOURCES.filter(r => r.categorySlug === cat.slug).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Recently added */}
            <div
                className="rounded-2xl p-5"
                style={{ background: 'var(--about-card-bg)', border: '1px solid var(--about-card-border)' }}
            >
                <p className="text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4">Нещодавно додано</p>
                <ul className="list-none p-0 m-0 flex flex-col divide-y" style={{ borderColor: 'var(--about-card-border)' }}>
                    {recentlyAdded.slice(0, 5).map(r => {
                        const Icon = r.icon
                        return (
                            <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5 no-underline">
                                    <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5" style={{ background: r.bg }}>
                                        <Icon size={12} color={r.accent} strokeWidth={1.8}/>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[12.5px] font-medium leading-snug m-0 line-clamp-2 transition-colors group-hover:text-blue-400"
                                           style={{ color: 'var(--about-desc)' }}>
                                            {r.title}
                                        </p>
                                        <span className="text-[11px]" style={{ color: 'var(--about-muted)' }}>
                                            {new Date(r.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )

    return (
        <>
            <div className="min-h-screen relative" style={{ background: 'var(--about-bg)', paddingTop: '80px' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] pointer-events-none"
                     style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }}/>

                {/* PAGE HEADER */}
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-10 pb-6">
                    <div className="flex items-center gap-2 mb-4 text-[13px]" style={{ color: 'var(--about-muted)' }}>
                        <Link href="/" className="transition-colors hover:text-blue-400" style={{ color: 'var(--about-muted)', textDecoration: 'none' }}>
                            Головна
                        </Link>
                        <span className="text-[10px]">›</span>
                        <span style={{ color: 'var(--about-text)' }}>Ресурси</span>
                    </div>
                    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4 px-3 py-1 rounded-full"
                          style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        Корисні посилання
                    </span>
                    <h1
                        className="text-[clamp(28px,4vw,48px)] font-bold leading-tight m-0 mb-2"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--about-text)' }}
                    >
                        Корисні ресурси
                    </h1>
                    <p className="text-[15px]" style={{ color: 'var(--about-desc)' }}>
                        {RESOURCES.length} ресурсів · зовнішні сайти та сервіси для мешканців Черкас
                    </p>

                    {/* Mobile/tablet search (< lg) */}
                    <div
                        className="lg:hidden flex items-center gap-2.5 rounded-xl px-4 py-3 mt-4"
                        style={{ background: 'var(--about-input-bg)', border: '1px solid var(--about-input-border)' }}
                    >
                        <Search size={15} style={{ color: 'var(--about-label)', flexShrink: 0 }}/>
                        <input
                            type="text" placeholder="Пошук ресурсів..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[color:var(--about-muted)]"
                            style={{ color: 'var(--about-text)', fontFamily: 'var(--font-body)' }}
                        />
                        {search && <button onClick={() => setSearch('')} style={{ color: 'var(--about-muted)' }}><X size={14}/></button>}
                    </div>

                    {/* Mobile/tablet category pills */}
                    <div className="lg:hidden flex flex-wrap gap-2 mt-4">
                        {CATS.map(cat => (
                            <button
                                key={cat.slug}
                                onClick={() => setActiveCategory(cat.slug)}
                                className="text-[12.5px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150"
                                style={activeCategory === cat.slug
                                    ? { background: 'var(--filter-active-bg)', color: 'var(--filter-active-text)', borderColor: 'var(--filter-active-border)' }
                                    : { background: 'var(--filter-inactive-bg)', color: 'var(--filter-inactive-text)', borderColor: 'var(--filter-inactive-border)' }
                                }
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <InnerPageLayout sidebar={sidebar} bottomNavItems={bottomNavItems}>

                    <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
                        Знайдено <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{filtered.length}</span> ресурсів
                    </p>

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
                             style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>Нічого не знайдено</p>
                            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>Спробуйте змінити пошуковий запит або категорію</p>
                            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
                                    className="mt-4 text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>
                                Скинути фільтри
                            </button>
                        </div>
                    )}

                    {/* LIST */}
                    {view === 'list' && filtered.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                            {filtered.map((res) => {
                                const Icon = res.icon
                                return (
                                    <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                                       className="anim-in res-list-item flex items-center gap-4 rounded-2xl shadow-sm px-5 py-4 no-underline"
                                       style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                                        <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: res.accent }}/>
                                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                            <Icon size={18} color={res.accent} strokeWidth={1.8}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-[14px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>{res.title}</p>
                                                {res.isNew && <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>}
                                            </div>
                                            <p className="text-[13px] m-0 mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{res.description}</p>
                                        </div>
                                        <span className="hidden sm:inline-flex shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>{res.category}</span>
                                        <span className="hidden md:block shrink-0 text-[12px] w-24 text-right" style={{ color: 'var(--text-muted)' }}>
                                            {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <ExternalLink size={15} className="list-ext shrink-0" style={{ color: 'var(--text-muted)' }}/>
                                    </a>
                                )
                            })}
                        </div>
                    )}

                    {/* TABLE */}
                    {view === 'table' && filtered.length > 0 && (
                        <div className="anim-in rounded-2xl shadow-sm overflow-hidden"
                             style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                            <table className="w-full border-collapse">
                                <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Ресурс', 'Категорія', 'Додано', ''].map(h => (
                                        <th key={h} className="text-left text-[11.5px] font-semibold uppercase tracking-wide px-5 py-3.5"
                                            style={{ color: 'var(--table-header-text)' }}>{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map(res => {
                                    const Icon = res.icon
                                    return (
                                        <tr key={res.id} className="res-row cursor-pointer"
                                            style={{ borderBottom: '1px solid var(--border)' }}
                                            onClick={() => window.open(res.url, '_blank')}>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                                        <Icon size={14} color={res.accent} strokeWidth={1.8}/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-[13.5px] m-0" style={{ color: 'var(--text-primary)' }}>{res.title}</p>
                                                            {res.isNew && <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>}
                                                        </div>
                                                        <p className="text-[11.5px] m-0" style={{ color: 'var(--text-muted)' }}>{res.titleEn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 hidden sm:table-cell">
                                                <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>{res.category}</span>
                                            </td>
                                            <td className="px-4 py-3.5 hidden md:table-cell text-[13px]" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <ExternalLink size={14} className="row-ext" style={{ color: 'var(--text-muted)' }}/>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* GRID */}
                    {view === 'grid' && filtered.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filtered.map((res) => {
                                const Icon = res.icon
                                return (
                                    <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                                       className="anim-in res-grid-card city-card flex flex-col rounded-2xl shadow-sm overflow-hidden no-underline"
                                    >
                                        <div className="h-1 opacity-80" style={{ background: res.accent }}/>
                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: res.bg }}>
                                                    <Icon size={18} color={res.accent} strokeWidth={1.8}/>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {res.isNew && <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>}
                                                    <ExternalLink size={13} className="grid-ext" style={{ color: 'var(--text-muted)' }}/>
                                                </div>
                                            </div>
                                            <p className="font-semibold text-[14px] m-0 leading-snug mb-1" style={{ color: 'var(--text-primary)' }}>{res.title}</p>
                                            <p className="text-[11px] m-0 mb-3" style={{ color: 'var(--text-muted)' }}>{res.titleEn}</p>
                                            <p className="text-[12px] leading-relaxed flex-1 m-0 mb-4 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{res.description}</p>
                                            <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                                                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>{res.category}</span>
                                                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                                                </span>
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                        </div>
                    )}
                </InnerPageLayout>
            </div>

            {/* RECENT MODAL */}
            {recentModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setRecentModal(false) }}
                >
                    <div className="modal-panel rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-input)' }}>
                                    <Clock size={13} style={{ color: 'var(--text-secondary)' }}/>
                                </div>
                                <p className="font-semibold text-[15px] m-0" style={{ color: 'var(--text-primary)' }}>Нещодавно додано</p>
                            </div>
                            <button onClick={() => setRecentModal(false)} className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                    style={{ color: 'var(--text-muted)' }}>
                                <X size={16}/>
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1">
                            <ul className="list-none p-0 m-0 divide-y" style={{ borderColor: 'var(--border)' }}>
                                {recentlyAdded.map(r => {
                                    const Icon = r.icon
                                    return (
                                        <li key={r.id}>
                                            <a href={r.url} target="_blank" rel="noopener noreferrer"
                                               onClick={() => setRecentModal(false)}
                                               className="group flex items-start gap-3 px-5 py-3.5 no-underline transition-colors"
                                               style={{ color: 'inherit' }}>
                                                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-0.5" style={{ background: r.bg }}>
                                                    <Icon size={16} color={r.accent} strokeWidth={1.8}/>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-medium leading-snug m-0 transition-colors group-hover:text-[color:var(--text-accent)]"
                                                       style={{ color: 'var(--text-primary)' }}>{r.title}</p>
                                                    <p className="text-[12px] m-0 mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{r.description}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                                            {new Date(r.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span style={{ color: 'var(--border)' }} className="text-[11px]">·</span>
                                                        <span className="text-[11px] font-medium" style={{ color: r.accent }}>{r.category}</span>
                                                    </div>
                                                </div>
                                                <ExternalLink size={13} className="shrink-0 mt-1 transition-colors" style={{ color: 'var(--text-muted)' }}/>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                            <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>
                                Знайшли неактуальне посилання?{' '}
                                <a href="mailto:info@portal.cherkasy.ua" style={{ color: 'var(--text-accent)' }} className="hover:underline">Напишіть нам</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}