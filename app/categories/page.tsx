'use client'

import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital, Search,
    X, Clock,
} from 'lucide-react'
import InnerPageLayout, {BottomNavItem} from "@/app/components/inner-page-layout";
import { DEFAULT_VIEW, VIEW_OPTIONS, ViewMode } from '../constants/view-mode';

/* ─── Data ───────────────────────────────────────────────────── */
interface Category {
    id:       string
    title:    string
    titleEn:  string
    icon:     React.ElementType
    photo:    string
    accent:   string
    bg:       string
    services: string[]
    count:    number
}

const categories: Category[] = [
    { id: 'health',        title: "Здоров'я",          titleEn: 'Health',          icon: Heart,         photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=50&auto=format', accent: '#ef4444', bg: '#fef2f2', services: ['Лікарні', 'Поліклініки', 'Аптеки', 'Лабораторії'], count: 24 },
    { id: 'education',     title: 'Освіта',             titleEn: 'Education',       icon: GraduationCap, photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=50&auto=format', accent: '#3b82f6', bg: '#eff6ff', services: ['Школи', 'Університети', 'Бібліотеки', 'Курси'],      count: 32 },
    { id: 'council',       title: 'Міська Рада',        titleEn: 'City Council',    icon: Building2,     photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=50&auto=format', accent: '#f59e0b', bg: '#fffbeb', services: ['Документи', 'Дозволи', 'Реєстрація', 'Петиції'],     count: 18 },
    { id: 'social',        title: 'Соціальні Послуги',  titleEn: 'Social Services', icon: Users,         photo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=50&auto=format', accent: '#8b5cf6', bg: '#f5f3ff', services: ['Допомога', 'Пільги', 'Субсидії', 'Підтримка'],       count: 28 },
    { id: 'utilities',     title: 'Комунальні Послуги', titleEn: 'Utilities',       icon: Zap,           photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=50&auto=format', accent: '#10b981', bg: '#ecfdf5', services: ['Вода', 'Електрика', 'Газ', 'Опалення'],           count: 15 },
    { id: 'business',      title: 'Бізнес',             titleEn: 'Business',        icon: Briefcase,     photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=50&auto=format', accent: '#06b6d4', bg: '#ecfeff', services: ['Ліцензії', 'Реєстрація', 'Підтримка', 'Звіти'],   count: 22 },
    { id: 'transport',     title: 'Транспорт',          titleEn: 'Transport',       icon: Bus,           photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=50&auto=format', accent: '#f97316', bg: '#fff7ed', services: ['Розклад', 'Парковка', 'Дороги', 'Права'],           count: 16 },
    { id: 'emergency',     title: 'Екстрені Служби',    titleEn: 'Emergency',       icon: AlertCircle,   photo: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&q=50&auto=format', accent: '#dc2626', bg: '#fef2f2', services: ['Пожежна', 'Поліція', 'Швидка', 'ДСНС'],           count: 8  },
    { id: 'appointments',  title: 'Онлайн Запис',       titleEn: 'Appointments',    icon: Calendar,      photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=50&auto=format', accent: '#14b8a6', bg: '#f0fdfa', services: ['Лікарі', 'Документи', 'Консультації', 'Прийом'], count: 19 },
    { id: 'schools',       title: 'Школи',              titleEn: 'Schools',         icon: School,        photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=50&auto=format', accent: '#6366f1', bg: '#eef2ff', services: ['Початкові', 'Середні', 'Ліцеї', 'Гімназії'],       count: 12 },
    { id: 'kindergartens', title: 'Дитячі Садки',       titleEn: 'Kindergartens',   icon: Baby,          photo: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?w=400&q=50&auto=format', accent: '#ec4899', bg: '#fdf2f8', services: ['Державні', 'Приватні', 'Запис', 'Черга'],          count: 14 },
    { id: 'hospitals',     title: 'Медичні Заклади',    titleEn: 'Medical',         icon: Hospital,      photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=50&auto=format', accent: '#2563eb', bg: '#eff6ff', services: ['Стаціонари', 'Амбулаторії', 'Центри', 'Диспансери'], count: 18 },
]


/* ─── Page ───────────────────────────────────────────────────── */
export default function CategoriesPage() {
    const [search,      setSearch]      = useState('')
    const [view,        setView]        = useState<ViewMode>(DEFAULT_VIEW)
    const [recentModal, setRecentModal] = useState(false)

    const totalServices = categories.reduce((s, c) => s + c.count, 0)

    const filtered = useMemo(() =>
        categories.filter(c =>
            !search ||
            c.title.toLowerCase().includes(search.toLowerCase()) ||
            c.titleEn.toLowerCase().includes(search.toLowerCase()) ||
            c.services.some(s => s.toLowerCase().includes(search.toLowerCase()))
        ), [search])

    const bottomNavItems: BottomNavItem[] = [
        ...VIEW_OPTIONS.map(v => ({
            key:     v.mode,
            icon:    <v.icon size={18} />,
            label:   v.label,
            active:  view === v.mode,
            onClick: () => setView(v.mode),
        })),
        {
            key:     'recent',
            icon:    <Clock size={18} />,
            label:   'Топ',
            active:  recentModal,
            onClick: () => setRecentModal(true),
        },
    ]

    const sidebar = (
        <>
            {/* Search */}
            <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                    type="text"
                    placeholder="Пошук категорії..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[color:var(--text-muted)]"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                />
                {search && (
                    <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}>
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* View toggle */}
            <div
                className="flex items-center gap-1 rounded-xl p-1 shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => (
                    <button
                        key={mode}
                        onClick={() => setView(mode)}
                        className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150"
                        style={view === mode
                            ? { background: 'var(--filter-active-bg)',   color: 'var(--filter-active-text)' }
                            : { background: 'transparent',               color: 'var(--text-secondary)' }
                        }
                    >
                        <Icon size={14} /> {label}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div
                className="rounded-2xl p-5 shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                <p className="font-semibold text-[14px] mb-3" style={{ color: 'var(--text-primary)' }}>
                    Статистика
                </p>
                {[
                    { v: categories.length,    l: 'Категорій'     },
                    { v: `${totalServices}+`,  l: 'Послуг всього' },
                    { v: filtered.length,      l: 'У пошуку'      },
                ].map(s => (
                    <div
                        key={s.l}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                        style={{ borderColor: 'var(--border)' }}
                    >
                        <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{s.l}</span>
                        <span className="font-bold text-[14px]" style={{ color: 'var(--text-primary)' }}>{s.v}</span>
                    </div>
                ))}
            </div>
        </>
    )

    return (
        <>
            <div className="min-h-screen" style={{ background: 'var(--bg-page)', paddingTop: '80px' }}>

                {/* PAGE HEADER */}
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 pt-8 pb-5">
                    <div className="flex items-center gap-2 mb-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                        <Link
                            href="/"
                            className="transition-colors hover:text-[color:var(--text-accent)]"
                            style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                        >
                            Головна
                        </Link>
                        <span className="text-[10px]">›</span>
                        <span style={{ color: 'var(--text-primary)' }}>Категорії послуг</span>
                    </div>
                    <h1
                        className="text-[clamp(24px,4vw,38px)] font-bold leading-tight m-0"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Категорії послуг
                    </h1>
                    <p className="mt-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                        {categories.length} категорій · {totalServices}+ послуг для мешканців Черкас
                    </p>
                </div>

                <InnerPageLayout sidebar={sidebar} bottomNavItems={bottomNavItems}>

                    <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
                        Знайдено{' '}
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {filtered.length}
                        </span>{' '}
                        категорій
                    </p>

                    {/* Empty */}
                    {filtered.length === 0 && (
                        <div
                            className="flex flex-col items-center justify-center py-20 text-center rounded-2xl"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                        >
                            <p className="text-4xl mb-3">🔍</p>
                            <p className="font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>
                                Нічого не знайдено
                            </p>
                            <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                                Спробуйте змінити запит
                            </p>
                            <button
                                onClick={() => setSearch('')}
                                className="mt-4 text-[13px] font-medium"
                                style={{ color: 'var(--text-accent)' }}
                            >
                                Скинути пошук
                            </button>
                        </div>
                    )}

                    {/* ── GRID ── */}
                    {view === 'grid' && filtered.length > 0 && (
                        <div
                            className="grid gap-4"
                            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
                        >
                            {filtered.map(cat => {
                                const Icon = cat.icon
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/categories/${cat.id}`}
                                        className="city-card flex flex-col rounded-2xl overflow-hidden shadow-sm no-underline"
                                    >
                                        {/* Colour bar */}
                                        <div className="h-1 opacity-80" style={{ background: cat.accent }} />

                                        {/* Photo */}
                                        <div className="h-[140px] overflow-hidden relative bg-slate-100">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={cat.photo}
                                                alt={cat.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="card-img w-full h-full object-cover block"
                                            />
                                            <div
                                                className="absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                                style={{
                                                    background:     'rgba(255,255,255,0.92)',
                                                    backdropFilter: 'blur(6px)',
                                                    color:          cat.accent,
                                                }}
                                            >
                                                {cat.count} послуг
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="flex flex-col flex-1 px-4 pt-4 pb-4">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div
                                                    className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                                                    style={{ background: cat.bg }}
                                                >
                                                    <Icon size={17} color={cat.accent} strokeWidth={1.8} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[14px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                                        {cat.title}
                                                    </p>
                                                    <p className="text-[11px] m-0 font-medium" style={{ color: 'var(--text-muted)' }}>
                                                        {cat.titleEn}
                                                    </p>
                                                </div>
                                            </div>

                                            <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-1 flex-1">
                                                {cat.services.map(s => (
                                                    <li
                                                        key={s}
                                                        className="flex items-center gap-2 text-[12.5px]"
                                                        style={{ color: 'var(--text-secondary)' }}
                                                    >
                                                        <span
                                                            className="w-[4px] h-[4px] rounded-full shrink-0 opacity-50"
                                                            style={{ background: cat.accent }}
                                                        />
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div
                                                className="flex items-center gap-1 text-[12.5px] font-semibold mt-auto"
                                                style={{ color: cat.accent }}
                                            >
                                                Переглянути <span className="card-arrow">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* ── LIST ── */}
                    {view === 'list' && filtered.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                            {filtered.map(cat => {
                                const Icon = cat.icon
                                return (
                                    <Link
                                        key={cat.id}
                                        href={`/categories/${cat.id}`}
                                        className="res-list-item flex items-center gap-4 rounded-2xl shadow-sm px-5 py-4 no-underline"
                                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                                    >
                                        <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: cat.accent }} />
                                        <div
                                            className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                                            style={{ background: cat.bg }}
                                        >
                                            <Icon size={18} color={cat.accent} strokeWidth={1.8} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[14px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                                {cat.title}
                                            </p>
                                            <p className="text-[13px] m-0 mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                                                {cat.services.join(', ')}
                                            </p>
                                        </div>
                                        <span
                                            className="hidden sm:inline-flex shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                            style={{ background: cat.bg, color: cat.accent }}
                                        >
                                            {cat.count} послуг
                                        </span>
                                        <span className="list-ext shrink-0 text-[12px] font-medium" style={{ color: 'var(--text-accent)' }}>
                                            →
                                        </span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* ── TABLE ── */}
                    {view === 'table' && filtered.length > 0 && (
                        <div
                            className="rounded-2xl shadow-sm overflow-hidden"
                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                        >
                            <table className="w-full border-collapse">
                                <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    {['Категорія', 'Послуги', 'Кількість', ''].map(h => (
                                        <th
                                            key={h}
                                            className="text-left text-[11.5px] font-semibold uppercase tracking-wide px-5 py-3.5"
                                            style={{ color: 'var(--table-header-text)' }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map(cat => {
                                    const Icon = cat.icon
                                    return (
                                        <tr
                                            key={cat.id}
                                            className="res-row cursor-pointer"
                                            style={{ borderBottom: '1px solid var(--border)' }}
                                            onClick={() => { window.location.href = `/categories/${cat.id}` }}
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                                                        style={{ background: cat.bg }}
                                                    >
                                                        <Icon size={14} color={cat.accent} strokeWidth={1.8} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-[13.5px] m-0" style={{ color: 'var(--text-primary)' }}>
                                                            {cat.title}
                                                        </p>
                                                        <p className="text-[11.5px] m-0" style={{ color: 'var(--text-muted)' }}>
                                                            {cat.titleEn}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 hidden md:table-cell">
                                                <p className="text-[12.5px] m-0" style={{ color: 'var(--text-secondary)' }}>
                                                    {cat.services.join(' · ')}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5 hidden sm:table-cell">
                                                    <span
                                                        className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full"
                                                        style={{ background: cat.bg, color: cat.accent }}
                                                    >
                                                        {cat.count}
                                                    </span>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="row-ext text-[13px]" style={{ color: 'var(--text-accent)' }}>→</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </InnerPageLayout>
            </div>

            {/* TOP MODAL */}
            {recentModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                    style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setRecentModal(false) }}
                >
                    <div
                        className="modal-panel rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                    >
                        <div
                            className="flex items-center justify-between px-5 py-4"
                            style={{ borderBottom: '1px solid var(--border)' }}
                        >
                            <p className="font-semibold text-[15px] m-0" style={{ color: 'var(--text-primary)' }}>
                                Топ категорій за кількістю послуг
                            </p>
                            <button
                                onClick={() => setRecentModal(false)}
                                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <ul
                            className="list-none p-0 m-0 max-h-[60vh] overflow-y-auto"
                            style={{ borderColor: 'var(--border)' }}
                        >
                            {[...categories]
                                .sort((a, b) => b.count - a.count)
                                .slice(0, 8)
                                .map(cat => {
                                    const Icon = cat.icon
                                    return (
                                        <li key={cat.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <Link
                                                href={`/categories/${cat.id}`}
                                                onClick={() => setRecentModal(false)}
                                                className="flex items-center gap-3 px-5 py-3.5 no-underline transition-colors"
                                                style={{ color: 'inherit' }}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                                                    style={{ background: cat.bg }}
                                                >
                                                    <Icon size={14} color={cat.accent} strokeWidth={1.8} />
                                                </div>
                                                <p
                                                    className="flex-1 text-[13.5px] font-medium m-0"
                                                    style={{ color: 'var(--text-primary)' }}
                                                >
                                                    {cat.title}
                                                </p>
                                                <span
                                                    className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full"
                                                    style={{ background: cat.bg, color: cat.accent }}
                                                >
                                                    {cat.count}
                                                </span>
                                            </Link>
                                        </li>
                                    )
                                })}
                        </ul>
                    </div>
                </div>
            )}
        </>
    )
}