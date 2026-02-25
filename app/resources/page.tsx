'use client'

import Link from 'next/link'
import {
    Hospital, Users, Shield, Building2, Bus,
    GraduationCap, Zap, ExternalLink, Search,
    Clock, LayoutList, Table2, X, LayoutGrid, SlidersHorizontal,
} from 'lucide-react'
import React, { useState, useMemo, useEffect } from 'react'

interface Resource {
    id: string
    title: string
    titleEn: string
    description: string
    url: string
    category: string
    categorySlug: string
    icon: React.ElementType
    accent: string
    bg: string
    addedAt: string
    isNew?: boolean
}

const RESOURCES: Resource[] = [
    {
        id: 'city-council',
        title: 'Черкаська міська рада',
        titleEn: 'City Council',
        description: 'Рішення, розпорядження, новини та контакти депутатів міської ради.',
        url: 'https://rada.cherkasy.ua',
        category: 'Міська рада',
        categorySlug: 'council',
        icon: Building2,
        accent: '#f59e0b',
        bg: '#fffbeb',
        addedAt: '2025-02-10',
        isNew: true,
    },
    {
        id: 'oblast-hospital',
        title: 'Черкаська обласна лікарня',
        titleEn: 'Regional Hospital',
        description: 'Запис на прийом, відділення та графік роботи лікарів.',
        url: 'https://obllikarna.ck.ua',
        category: 'Лікарні',
        categorySlug: 'hospitals',
        icon: Hospital,
        accent: '#ef4444',
        bg: '#fef2f2',
        addedAt: '2025-02-08',
        isNew: true,
    },
    {
        id: 'electrotrans',
        title: 'Черкасиелектротранс',
        titleEn: 'Electrotrans',
        description: 'Розклад трамваїв і тролейбусів, маршрути та зупинки.',
        url: 'https://electrotrans.ck.ua',
        category: 'Транспорт',
        categorySlug: 'transport',
        icon: Bus,
        accent: '#f97316',
        bg: '#fff7ed',
        addedAt: '2025-02-05',
        isNew: true,
    },
    {
        id: 'social',
        title: 'Управління соціального захисту',
        titleEn: 'Social Protection',
        description: 'Субсидії, пільги, допомога при народженні дитини та виплати для ВПО.',
        url: 'https://social.cherkasy.ua',
        category: 'Соціальні питання',
        categorySlug: 'social',
        icon: Users,
        accent: '#8b5cf6',
        bg: '#f5f3ff',
        addedAt: '2025-02-01',
    },
    {
        id: 'safety',
        title: 'Черкаський центр безпеки',
        titleEn: 'Safety Center',
        description: 'Гаряча лінія, оперативна обстановка, контакти служб порятунку та поліції.',
        url: 'https://safety.cherkasy.ua',
        category: 'Безпека',
        categorySlug: 'safety',
        icon: Shield,
        accent: '#dc2626',
        bg: '#fef2f2',
        addedAt: '2025-01-28',
    },
    {
        id: 'children-hospital',
        title: 'Черкаська дитяча лікарня',
        titleEn: "Children's Hospital",
        description: 'Педіатричні послуги, планові щеплення та довідки для школи.',
        url: 'https://dytlikar.ck.ua',
        category: 'Лікарні',
        categorySlug: 'hospitals',
        icon: Hospital,
        accent: '#ef4444',
        bg: '#fef2f2',
        addedAt: '2025-01-20',
    },
    {
        id: 'education',
        title: 'Відділ освіти міськради',
        titleEn: 'Education Dept.',
        description: 'Запис у школи та дитячі садки, НМТ, шкільні округи, гранти для педагогів.',
        url: 'https://osvita.cherkasy.ua',
        category: 'Освіта',
        categorySlug: 'education',
        icon: GraduationCap,
        accent: '#3b82f6',
        bg: '#eff6ff',
        addedAt: '2025-01-15',
    },
    {
        id: 'gaz',
        title: 'Черкасигаз — особистий кабінет',
        titleEn: 'Gas Provider',
        description: 'Передача показань лічильника, оплата газу та заявки на обслуговування.',
        url: 'https://cherkasygaz.ua',
        category: 'Комунальні послуги',
        categorySlug: 'utilities',
        icon: Zap,
        accent: '#10b981',
        bg: '#ecfdf5',
        addedAt: '2025-01-10',
    },
    {
        id: 'pension',
        title: 'Пенсійний фонд — Черкаське управління',
        titleEn: 'Pension Fund',
        description: 'Призначення пенсій, виплати, перерахунки та е-кабінет застрахованої особи.',
        url: 'https://pfu.gov.ua/cherkasy',
        category: 'Соціальні питання',
        categorySlug: 'social',
        icon: Users,
        accent: '#8b5cf6',
        bg: '#f5f3ff',
        addedAt: '2025-01-05',
    },
    {
        id: 'vodokanal',
        title: 'Водоканал Черкаси',
        titleEn: 'Water Supply',
        description: 'Особистий кабінет, тарифи, аварійна служба та якість питної води.',
        url: 'https://vodokanal.ck.ua',
        category: 'Комунальні послуги',
        categorySlug: 'utilities',
        icon: Zap,
        accent: '#10b981',
        bg: '#ecfdf5',
        addedAt: '2024-12-28',
    },
    {
        id: 'police',
        title: 'Поліція Черкащини',
        titleEn: 'Cherkasy Police',
        description: 'Звернення онлайн, гаряча лінія та профілактика злочинності.',
        url: 'https://ck.npu.gov.ua',
        category: 'Безпека',
        categorySlug: 'safety',
        icon: Shield,
        accent: '#dc2626',
        bg: '#fef2f2',
        addedAt: '2024-12-20',
    },
    {
        id: 'bus',
        title: 'Маршрутки Черкас — розклад',
        titleEn: 'Bus Schedule',
        description: 'Актуальний розклад приміських та міських маршрутів, онлайн-квитки.',
        url: 'https://bus.cherkasy.ua',
        category: 'Транспорт',
        categorySlug: 'transport',
        icon: Bus,
        accent: '#f97316',
        bg: '#fff7ed',
        addedAt: '2024-12-15',
    },
]

const CATEGORIES = [
    { label: 'Всі', slug: 'all' },
    { label: 'Лікарні', slug: 'hospitals' },
    { label: 'Соціальні питання', slug: 'social' },
    { label: 'Безпека', slug: 'safety' },
    { label: 'Міська рада', slug: 'council' },
    { label: 'Транспорт', slug: 'transport' },
    { label: 'Освіта', slug: 'education' },
    { label: 'Комунальні послуги', slug: 'utilities' },
]

type ViewMode = 'list' | 'table' | 'grid'

const VIEW_OPTIONS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
    { mode: 'list', icon: LayoutList, label: 'Список' },
    { mode: 'table', icon: Table2, label: 'Таблиця' },
    { mode: 'grid', icon: LayoutGrid, label: 'Сітка' },
]

export default function ResourcesPage() {
    const [activeCategory, setActiveCategory] = useState('all')
    const [search, setSearch] = useState('')
    const [view, setView] = useState<ViewMode>('list')
    const [fabOpen, setFabOpen] = useState(false)
    const [recentModal, setRecentModal] = useState(false)

    // Close FAB when clicking outside
    useEffect(() => {
        if (!fabOpen) return
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (!target.closest('#fab-root')) setFabOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [fabOpen])

    // Lock scroll when modal open
    useEffect(() => {
        document.body.style.overflow = recentModal ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [recentModal])

    const filtered = useMemo(() => {
        return RESOURCES.filter(r => {
            const matchCat = activeCategory === 'all' || r.categorySlug === activeCategory
            const q = search.toLowerCase()
            const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
            return matchCat && matchSearch
        })
    }, [activeCategory, search])

    const recentlyAdded = useMemo(
        () => [...RESOURCES]
            .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
            .slice(0, 8),
        []
    )

    const currentViewOption = VIEW_OPTIONS.find(v => v.mode === view)!

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

                .res-list-item { transition: transform .18s cubic-bezier(.4,0,.2,1), box-shadow .18s; }
                .res-list-item:hover { transform: translateX(3px); box-shadow: 0 2px 12px rgba(0,0,0,0.07); }
                .res-list-item .list-ext { opacity: 0; transition: opacity .15s; }
                .res-list-item:hover .list-ext { opacity: 1; }

                .res-row { transition: background .15s; }
                .res-row:hover { background: #f8faff; }
                .res-row .row-ext { opacity: 0; transition: opacity .15s; }
                .res-row:hover .row-ext { opacity: 1; }

                .res-grid-card { transition: transform .22s cubic-bezier(.4,0,.2,1), box-shadow .22s; }
                .res-grid-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
                .res-grid-card .grid-ext { opacity: 0; transition: opacity .15s; }
                .res-grid-card:hover .grid-ext { opacity: 1; }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-in { opacity: 0; animation: fadeIn .35s ease-out forwards; }

                @keyframes fabMenuIn {
                    from { opacity: 0; transform: translateY(8px) scale(.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .fab-menu { animation: fabMenuIn .18s ease-out forwards; }

                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .modal-panel { animation: modalIn .22s ease-out forwards; }
            `}</style>

            <div className="min-h-screen bg-[#f4f6fb]" style={{ fontFamily: "'DM Sans', sans-serif", paddingTop: '96px' }}>

                {/* ── PAGE HEADER ── */}
                <div className="max-w-[1280px] mx-auto px-6 pt-7 pb-0">
                    <div className="flex items-end justify-between flex-wrap gap-5">
                        <div>
                            <div className="flex items-center gap-2 mb-2.5 text-[13px] text-slate-400">
                                <Link href="/" className="text-slate-400 no-underline hover:text-blue-600 transition-colors">
                                    Головна
                                </Link>
                                <span className="text-[10px]">›</span>
                                <span className="text-slate-800">Ресурси</span>
                            </div>
                            <h1
                                className="text-[clamp(26px,4vw,40px)] font-normal text-slate-900 leading-tight m-0"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                Корисні ресурси
                            </h1>
                            <p className="mt-1.5 text-[14px] text-slate-500">
                                {RESOURCES.length} ресурсів&nbsp;·&nbsp;зовнішні сайти та сервіси для мешканців Черкас
                            </p>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 min-w-[260px] shadow-sm">
                            <Search size={15} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Пошук ресурсів..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="border-none bg-transparent outline-none text-[14px] text-slate-800 w-full placeholder:text-slate-400"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            />
                            {search && (
                                <button onClick={() => setSearch('')} className="text-slate-300 hover:text-slate-500 transition-colors">
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category filters */}
                    <div className="flex flex-wrap gap-2 mt-5">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.slug}
                                onClick={() => setActiveCategory(cat.slug)}
                                className={`text-[13px] font-medium px-4 py-1.5 rounded-full border transition-all duration-150 ${
                                    activeCategory === cat.slug
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="max-w-[1280px] mx-auto px-6 pt-5 pb-24 lg:pb-16 flex gap-6 items-start">

                    {/* ── MAIN ── */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-slate-400 mb-4">
                            Знайдено <span className="font-semibold text-slate-700">{filtered.length}</span> ресурсів
                        </p>

                        {/* Empty state */}
                        {filtered.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-[#e8edf5]">
                                <p className="text-4xl mb-3">🔍</p>
                                <p className="font-semibold text-slate-700 text-[15px] mb-1">Нічого не знайдено</p>
                                <p className="text-[13px] text-slate-400">Спробуйте змінити пошуковий запит або категорію</p>
                                <button
                                    onClick={() => { setSearch(''); setActiveCategory('all') }}
                                    className="mt-4 text-[13px] font-medium text-blue-600 hover:underline"
                                >
                                    Скинути фільтри
                                </button>
                            </div>
                        )}

                        {/* ── LIST VIEW ── */}
                        {view === 'list' && filtered.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                {filtered.map((res, idx) => {
                                    const Icon = res.icon
                                    return (
                                        <a
                                            key={res.id}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="anim-in res-list-item flex items-center gap-4 bg-white rounded-2xl border border-[#e8edf5] shadow-sm px-5 py-4 no-underline"
                                            style={{ animationDelay: `${idx * 35}ms` }}
                                        >
                                            <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: res.accent }} />
                                            <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                                <Icon size={18} color={res.accent} strokeWidth={1.8} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-[14px] text-slate-900 m-0 leading-tight">{res.title}</p>
                                                    {res.isNew && (
                                                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>
                                                    )}
                                                </div>
                                                <p className="text-[13px] text-slate-500 m-0 mt-0.5 truncate">{res.description}</p>
                                            </div>
                                            <span className="hidden sm:inline-flex shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>
                                                {res.category}
                                            </span>
                                            <span className="hidden md:block shrink-0 text-[12px] text-slate-400 w-24 text-right">
                                                {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <ExternalLink size={15} className="list-ext shrink-0 text-slate-400" />
                                        </a>
                                    )
                                })}
                            </div>
                        )}

                        {/* ── TABLE VIEW ── */}
                        {view === 'table' && filtered.length > 0 && (
                            <div className="anim-in bg-white rounded-2xl border border-[#e8edf5] shadow-sm overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="text-left text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-5 py-3.5">Ресурс</th>
                                        <th className="text-left text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-4 py-3.5 hidden sm:table-cell">Категорія</th>
                                        <th className="text-left text-[12px] font-semibold text-slate-400 uppercase tracking-wide px-4 py-3.5 hidden md:table-cell">Додано</th>
                                        <th className="px-4 py-3.5 w-10" />
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filtered.map((res) => {
                                        const Icon = res.icon
                                        return (
                                            <tr
                                                key={res.id}
                                                className="res-row border-b border-slate-50 last:border-0 cursor-pointer"
                                                onClick={() => window.open(res.url, '_blank')}
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                                            <Icon size={15} color={res.accent} strokeWidth={1.8} />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="font-semibold text-[14px] text-slate-800 m-0 leading-tight">{res.title}</p>
                                                                {res.isNew && (
                                                                    <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>
                                                                )}
                                                            </div>
                                                            <p className="text-[12px] text-slate-400 m-0">{res.titleEn}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 hidden sm:table-cell">
                                                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>
                                                            {res.category}
                                                        </span>
                                                </td>
                                                <td className="px-4 py-3.5 hidden md:table-cell text-[13px] text-slate-400">
                                                    {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <ExternalLink size={14} className="row-ext text-slate-400" />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* ── GRID VIEW ── */}
                        {view === 'grid' && filtered.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map((res, idx) => {
                                    const Icon = res.icon
                                    return (
                                        <a
                                            key={res.id}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="anim-in res-grid-card flex flex-col bg-white rounded-2xl border border-[#e8edf5] shadow-sm overflow-hidden no-underline"
                                            style={{ animationDelay: `${idx * 35}ms` }}
                                        >
                                            <div className="h-1" style={{ background: res.accent, opacity: 0.85 }} />
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: res.bg }}>
                                                        <Icon size={18} color={res.accent} strokeWidth={1.8} />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        {res.isNew && (
                                                            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>
                                                        )}
                                                        <ExternalLink size={13} className="grid-ext text-slate-400" />
                                                    </div>
                                                </div>
                                                <p className="font-semibold text-[14px] text-slate-900 m-0 leading-snug mb-1.5">{res.title}</p>
                                                <p className="text-[11px] text-slate-400 m-0 mb-3">{res.titleEn}</p>
                                                <p className="text-[12px] text-slate-500 leading-relaxed flex-1 m-0 mb-4 line-clamp-3">{res.description}</p>
                                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                                                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: res.bg, color: res.accent }}>
                                                        {res.category}
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {/* ── DESKTOP SIDEBAR 320px ── */}
                    <aside className="w-[320px] shrink-0 hidden lg:flex flex-col gap-4 sticky top-[100px]">
                        {/* View toggle */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                            {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
                                <button
                                    key={mode}
                                    onClick={() => setView(mode)}
                                    className={`flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                                        view === mode ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon size={14} />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Recently added */}
                        <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Clock size={13} className="text-slate-500" />
                                </div>
                                <p className="font-semibold text-[14px] text-slate-800 m-0">Нещодавно додано</p>
                            </div>
                            <ul className="list-none p-0 m-0 flex flex-col divide-y divide-slate-50">
                                {recentlyAdded.map(r => {
                                    const Icon = r.icon
                                    return (
                                        <li key={r.id} className="py-3 first:pt-0 last:pb-0">
                                            <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5 no-underline">
                                                <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5" style={{ background: r.bg }}>
                                                    <Icon size={13} color={r.accent} strokeWidth={1.8} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[13px] font-medium text-slate-700 group-hover:text-blue-600 leading-snug m-0 line-clamp-2 transition-colors">
                                                        {r.title}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-[11px] text-slate-400">
                                                            {new Date(r.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short' })}
                                                        </span>
                                                        <span className="text-[11px] text-slate-300">·</span>
                                                        <span className="text-[11px] font-medium" style={{ color: r.accent }}>{r.category}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                            <div className="mt-3 pt-3 border-t border-slate-50">
                                <p className="text-[12px] text-slate-400 leading-relaxed m-0">
                                    Знайшли неактуальне посилання?{' '}
                                    <a href="mailto:info@portal.cherkasy.ua" className="text-blue-500 hover:underline">Напишіть нам</a>
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                MOBILE / TABLET FLOATING CONTROLS
                Visible only on < lg screens
            ══════════════════════════════════════════ */}

            {/* Recent modal button */}
            <button
                onClick={() => setRecentModal(true)}
                className="lg:hidden fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-[13px] font-semibold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:border-slate-300 transition-all duration-200"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
                <Clock size={15} className="text-slate-500" />
                Нещодавно
            </button>

            {/* FAB — view switcher */}
            <div id="fab-root" className="lg:hidden fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
                {/* Expanded menu */}
                {fabOpen && (
                    <div className="fab-menu flex flex-col gap-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 mb-1">
                        {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
                            <button
                                key={mode}
                                onClick={() => { setView(mode); setFabOpen(false) }}
                                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 whitespace-nowrap ${
                                    view === mode
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-50'
                                }`}
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {/* FAB button */}
                <button
                    onClick={() => setFabOpen(v => !v)}
                    className={`flex items-center gap-2 text-[13px] font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 ${
                        fabOpen
                            ? 'bg-slate-900 text-white shadow-slate-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:shadow-xl hover:border-slate-300'
                    }`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    {fabOpen ? <X size={15} /> : <SlidersHorizontal size={15} className="text-slate-500" />}
                    {fabOpen ? 'Закрити' : currentViewOption.label}
                </button>
            </div>

            {/* ══════════════════════════════════════════
                RECENT RESOURCES MODAL
            ══════════════════════════════════════════ */}
            {recentModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                    style={{ background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setRecentModal(false) }}
                >
                    <div
                        className="modal-panel bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                                    <Clock size={13} className="text-slate-500" />
                                </div>
                                <p className="font-semibold text-[15px] text-slate-800 m-0">Нещодавно додано</p>
                            </div>
                            <button
                                onClick={() => setRecentModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal list */}
                        <div className="overflow-y-auto flex-1">
                            <ul className="list-none p-0 m-0 divide-y divide-slate-50">
                                {recentlyAdded.map(r => {
                                    const Icon = r.icon
                                    return (
                                        <li key={r.id}>
                                            <a
                                                href={r.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={() => setRecentModal(false)}
                                                className="group flex items-start gap-3 px-5 py-3.5 no-underline hover:bg-slate-50 transition-colors"
                                            >
                                                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center mt-0.5" style={{ background: r.bg }}>
                                                    <Icon size={16} color={r.accent} strokeWidth={1.8} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] font-medium text-slate-800 group-hover:text-blue-600 leading-snug m-0 transition-colors">
                                                        {r.title}
                                                    </p>
                                                    <p className="text-[12px] text-slate-400 m-0 mt-0.5 truncate">{r.description}</p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="text-[11px] text-slate-400">
                                                            {new Date(r.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-slate-200 text-[11px]">·</span>
                                                        <span className="text-[11px] font-medium" style={{ color: r.accent }}>{r.category}</span>
                                                    </div>
                                                </div>
                                                <ExternalLink size={13} className="shrink-0 text-slate-300 group-hover:text-slate-400 mt-1 transition-colors" />
                                            </a>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>

                        {/* Modal footer */}
                        <div className="px-5 py-3 border-t border-slate-50">
                            <p className="text-[12px] text-slate-400 m-0">
                                Знайшли неактуальне посилання?{' '}
                                <a href="mailto:info@portal.cherkasy.ua" className="text-blue-500 hover:underline">Напишіть нам</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}