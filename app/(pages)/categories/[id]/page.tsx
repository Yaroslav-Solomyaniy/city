'use client'

import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
    Heart, GraduationCap, Building2, Users,
    Bus, School, Baby, Hospital,
    ExternalLink, Search, X, ChevronRight,
    FolderOpen, Globe, ArrowLeft,
} from 'lucide-react'
import InnerPageLayout, {BottomNavItem} from "@/app/components/inner-page-layout";
import { DEFAULT_VIEW, VIEW_OPTIONS, ViewMode } from '@/app/constants/view-mode'

/* ─── Types ──────────────────────────────────────────────────── */
interface ResourceItem {
    type:  'resource'
    id:    string
    title: string
    titleEn: string
    description: string
    url:   string
    accent: string
    bg:    string
    icon:  React.ElementType
    addedAt: string
    isNew?: boolean
}

interface SubCategoryItem {
    type:   'subcategory'
    id:     string
    title:  string
    titleEn: string
    count:  number
    accent: string
    bg:     string
    icon:   React.ElementType
    items:  ResourceItem[]   // resources inside this subcategory
}

type CatItem = ResourceItem | SubCategoryItem

interface CategoryData {
    id:      string
    title:   string
    titleEn: string
    icon:    React.ElementType
    accent:  string
    bg:      string
    photo:   string
    description: string
    items:   CatItem[]
}

/* ─── Data ───────────────────────────────────────────────────── */
const CATALOG: Record<string, CategoryData> = {
    health: {
        id: 'health', title: "Здоров'я", titleEn: 'Health',
        icon: Heart, accent: '#ef4444', bg: '#fef2f2',
        photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&q=80',
        description: "Медичні заклади, аптеки, лабораторії та онлайн-запис до лікарів Черкаської громади.",
        items: [
            {
                type: 'subcategory', id: 'hospitals', title: 'Лікарні', titleEn: 'Hospitals',
                count: 4, accent: '#ef4444', bg: '#fef2f2', icon: Hospital,
                items: [
                    { type: 'resource', id: 'oblast-hosp', title: 'Черкаська обласна лікарня', titleEn: 'Regional Hospital', description: 'Запис на прийом, відділення, лікарі.', url: 'https://obllikarna.ck.ua', accent: '#ef4444', bg: '#fef2f2', icon: Hospital, addedAt: '2025-02-08', isNew: true },
                    { type: 'resource', id: 'city-hosp', title: 'Черкаська міська лікарня №1', titleEn: 'City Hospital #1', description: 'Стаціонарне та амбулаторне лікування.', url: '#', accent: '#ef4444', bg: '#fef2f2', icon: Hospital, addedAt: '2025-01-15' },
                    { type: 'resource', id: 'child-hosp', title: 'Черкаська дитяча лікарня', titleEn: "Children's Hospital", description: 'Педіатрія, щеплення, довідки для школи.', url: 'https://dytlikar.ck.ua', accent: '#ef4444', bg: '#fef2f2', icon: Hospital, addedAt: '2025-01-20' },
                    { type: 'resource', id: 'perinatal', title: 'Черкаський перинатальний центр', titleEn: 'Perinatal Center', description: 'Пологи, ведення вагітності, новонароджені.', url: '#', accent: '#ef4444', bg: '#fef2f2', icon: Hospital, addedAt: '2025-01-10' },
                ],
            },
            {
                type: 'subcategory', id: 'clinics', title: 'Поліклініки та амбулаторії', titleEn: 'Clinics',
                count: 3, accent: '#f97316', bg: '#fff7ed', icon: Heart,
                items: [
                    { type: 'resource', id: 'clinic-1', title: 'ЦПМСД №1 Черкаси', titleEn: 'Primary Care #1', description: 'Сімейна медицина, запис до терапевта.', url: '#', accent: '#f97316', bg: '#fff7ed', icon: Heart, addedAt: '2025-01-05' },
                    { type: 'resource', id: 'clinic-2', title: 'ЦПМСД №2 Черкаси', titleEn: 'Primary Care #2', description: 'Лікарі загальної практики, щеплення.', url: '#', accent: '#f97316', bg: '#fff7ed', icon: Heart, addedAt: '2024-12-10' },
                    { type: 'resource', id: 'dentist', title: 'Стоматологічна поліклініка', titleEn: 'Dental Clinic', description: 'Запис до стоматолога, ортодонтія, протезування.', url: '#', accent: '#f97316', bg: '#fff7ed', icon: Heart, addedAt: '2024-12-05' },
                ],
            },
            { type: 'resource', id: 'ehealth', title: 'eHealth — особистий кабінет пацієнта', titleEn: 'eHealth', description: 'Загальнонаціональна система, медкарта, рецепти онлайн.', url: 'https://patient.ehealth.gov.ua', accent: '#22c55e', bg: '#f0fdf4', icon: Globe, addedAt: '2025-02-10', isNew: true },
            { type: 'resource', id: 'psych', title: 'Психологічна підтримка ЧМР', titleEn: 'Mental Health', description: 'Психологічна допомога для мешканців, онлайн-консультації.', url: '#', accent: '#8b5cf6', bg: '#f5f3ff', icon: Users, addedAt: '2024-11-20' },
        ],
    },
    education: {
        id: 'education', title: 'Освіта', titleEn: 'Education',
        icon: GraduationCap, accent: '#3b82f6', bg: '#eff6ff',
        photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80',
        description: "Заклади освіти, вступ, гранти та онлайн-сервіси освіти Черкаської громади.",
        items: [
            {
                type: 'subcategory', id: 'schools-sub', title: 'Школи', titleEn: 'Schools',
                count: 3, accent: '#6366f1', bg: '#eef2ff', icon: School,
                items: [
                    { type: 'resource', id: 'school-reg', title: 'Реєстр шкіл Черкас', titleEn: 'Schools Registry', description: 'Усі загальноосвітні заклади, контакти, округи.', url: '#', accent: '#6366f1', bg: '#eef2ff', icon: School, addedAt: '2025-01-15' },
                    { type: 'resource', id: 'nmt', title: 'НМТ 2025 — підготовка', titleEn: 'NMT 2025', description: 'Реєстрація, програма, тренувальні тести НМТ.', url: '#', accent: '#6366f1', bg: '#eef2ff', icon: School, addedAt: '2025-02-01' },
                    { type: 'resource', id: 'lyceum', title: 'Черкаський обласний ліцей', titleEn: 'Oblast Lyceum', description: 'Профільне навчання, олімпіади, вступ.', url: '#', accent: '#6366f1', bg: '#eef2ff', icon: School, addedAt: '2024-11-10' },
                ],
            },
            {
                type: 'subcategory', id: 'kindergartens-sub', title: 'Дитячі садки', titleEn: 'Kindergartens',
                count: 2, accent: '#ec4899', bg: '#fdf2f8', icon: Baby,
                items: [
                    { type: 'resource', id: 'kg-reg', title: 'Запис у дитячий садок', titleEn: 'Kindergarten Registration', description: 'Електронна черга та реєстрація в ДНЗ.', url: '#', accent: '#ec4899', bg: '#fdf2f8', icon: Baby, addedAt: '2025-01-20', isNew: true },
                    { type: 'resource', id: 'kg-list', title: 'Реєстр ДНЗ Черкащини', titleEn: 'Kindergartens List', description: 'Усі дошкільні заклади, адреси, контакти.', url: '#', accent: '#ec4899', bg: '#fdf2f8', icon: Baby, addedAt: '2024-12-01' },
                ],
            },
            { type: 'resource', id: 'osvita-dept', title: 'Відділ освіти міськради', titleEn: 'Education Dept.', description: 'Накази, гранти для педагогів, новини освіти.', url: 'https://osvita.cherkasy.ua', accent: '#3b82f6', bg: '#eff6ff', icon: GraduationCap, addedAt: '2025-01-15' },
        ],
    },
    transport: {
        id: 'transport', title: 'Транспорт', titleEn: 'Transport',
        icon: Bus, accent: '#f97316', bg: '#fff7ed',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
        description: "Міський транспорт, розклад, паркування та дорожні служби Черкас.",
        items: [
            { type: 'resource', id: 'electrotrans', title: 'Черкасиелектротранс', titleEn: 'Electrotrans', description: 'Розклад трамваїв і тролейбусів, маршрути.', url: 'https://electrotrans.ck.ua', accent: '#f97316', bg: '#fff7ed', icon: Bus, addedAt: '2025-02-05', isNew: true },
            { type: 'resource', id: 'bus-sch', title: 'Маршрутки Черкас', titleEn: 'Bus Schedule', description: 'Актуальний розклад міських маршрутів, онлайн-квитки.', url: '#', accent: '#f97316', bg: '#fff7ed', icon: Bus, addedAt: '2024-12-15' },
            { type: 'resource', id: 'parking', title: 'Паркування в Черкасах', titleEn: 'Parking', description: 'Карта паркувальних місць, штрафи, абонементи.', url: '#', accent: '#64748b', bg: '#f8fafc', icon: Building2, addedAt: '2024-11-01' },
        ],
    },
    council: {
        id: 'council', title: 'Міська Рада', titleEn: 'City Council',
        icon: Building2, accent: '#f59e0b', bg: '#fffbeb',
        photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&q=80',
        description: "Офіційні ресурси Черкаської міської ради, рішення, петиції та документи.",
        items: [
            { type: 'resource', id: 'city-council', title: 'Черкаська міська рада', titleEn: 'City Council', description: 'Рішення, розпорядження, склад депутатів.', url: 'https://rada.cherkasy.ua', accent: '#f59e0b', bg: '#fffbeb', icon: Building2, addedAt: '2025-02-10', isNew: true },
            { type: 'resource', id: 'petitions', title: 'Електронні петиції', titleEn: 'E-Petitions', description: 'Подайте або підтримайте громадські ініціативи.', url: '#', accent: '#f59e0b', bg: '#fffbeb', icon: Users, addedAt: '2024-10-15' },
            { type: 'resource', id: 'permits', title: 'Дозволи та реєстрація', titleEn: 'Permits', description: 'Будівельні дозволи, реєстрація бізнесу, земельні питання.', url: '#', accent: '#f59e0b', bg: '#fffbeb', icon: Building2, addedAt: '2024-10-01' },
        ],
    },
}

// For categories not in catalog, show placeholder data
const getDefaultData = (id: string): CategoryData => ({
    id, title: id.charAt(0).toUpperCase() + id.slice(1), titleEn: id,
    icon: FolderOpen, accent: '#6366f1', bg: '#eef2ff',
    photo: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80',
    description: 'Ресурси та послуги цієї категорії.',
    items: [
        { type: 'resource', id: 'demo-1', title: 'Демонстраційний ресурс', titleEn: 'Demo Resource', description: 'Це демонстраційний ресурс для цієї категорії.', url: '#', accent: '#6366f1', bg: '#eef2ff', icon: Globe, addedAt: '2025-01-01', isNew: true },
    ],
})

/* ─── Page ───────────────────────────────────────────────────── */
export default function CategoryPage() {
    const params = useParams()
    const id = params?.id as string
    const cat = CATALOG[id] ?? getDefaultData(id)

    const [search, setSearch] = useState('')
    const [view,   setView]   = useState<ViewMode>(DEFAULT_VIEW)
    // If user clicked a subcategory, show its resources
    const [openSub, setOpenSub] = useState<SubCategoryItem | null>(null)

    const Icon = cat.icon

    // flatten resources at this level (no subcats selected) or inside the selected subcat
    const resources: ResourceItem[] = useMemo(() => {
        const source = openSub ? openSub.items : cat.items.filter((i): i is ResourceItem => i.type === 'resource')
        if (!search) return source
        const q = search.toLowerCase()
        return source.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q))
    }, [openSub, cat.items, search])

    const subcategories: SubCategoryItem[] = useMemo(() =>
        openSub ? [] : cat.items.filter((i): i is SubCategoryItem => i.type === 'subcategory'), [openSub, cat.items])

    const bottomNavItems: BottomNavItem[] = VIEW_OPTIONS.map(v => ({
        key: v.mode, icon: <v.icon size={18}/>, label: v.label,
        active: view === v.mode, onClick: () => setView(v.mode),
    }))

    const sidebar = (
        <>
            <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }}/>
                <input
                    type="text" placeholder="Пошук ресурсів..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-(--text-muted)"
                    style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                />
                {search && <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}><X size={14}/></button>}
            </div>

            <div
                className="flex items-center gap-1 rounded-xl p-1 shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                {VIEW_OPTIONS.map(({ mode, icon: VIcon, label }) => (
                    <button key={mode} onClick={() => setView(mode)}
                            className="flex flex-1 items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-150"
                            style={view === mode
                                ? { background: 'var(--filter-active-bg)', color: 'var(--filter-active-text)' }
                                : { background: 'transparent', color: 'var(--text-secondary)' }
                            }>
                        <VIcon size={14}/> {label}
                    </button>
                ))}
            </div>

            {/* Category info card */}
            <div
                className="rounded-2xl overflow-hidden shadow-sm"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
            >
                <div className="h-1 opacity-80" style={{ background: cat.accent }}/>
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center" style={{ background: cat.bg }}>
                            <Icon size={17} color={cat.accent} strokeWidth={1.8}/>
                        </div>
                        <div>
                            <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>{cat.title}</p>
                            <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>{cat.titleEn}</p>
                        </div>
                    </div>
                    <p className="text-[13px] leading-relaxed m-0" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>

                    {openSub && (
                        <button
                            onClick={() => { setOpenSub(null); setSearch('') }}
                            className="flex items-center gap-1.5 mt-4 text-[12.5px] font-semibold transition-colors"
                            style={{ color: cat.accent }}
                        >
                            <ArrowLeft size={13}/> Всі підкатегорії
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation of subcategories in sidebar */}
            {!openSub && subcategories.length > 0 && (
                <div className="rounded-2xl shadow-sm p-5"
                     style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                    <p className="font-semibold text-[13.5px] mb-3" style={{ color: 'var(--text-primary)' }}>Підкатегорії</p>
                    <div className="flex flex-col gap-1">
                        {subcategories.map(sub => (
                            <button key={sub.id} onClick={() => { setOpenSub(sub); setSearch('') }}
                                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium text-left transition-all duration-150"
                                    style={{ color: 'var(--sidebar-item-inactive-text)', border: '1px solid transparent' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--sidebar-item-hover)' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sub.accent }}/>
                                {sub.title}
                                <span className="ml-auto text-[11px] font-semibold opacity-60">{sub.count}</span>
                                <ChevronRight size={12} style={{ color: 'var(--text-muted)' }}/>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </>
    )

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg-page)', paddingTop: '80px' }}>

            {/* Hero strip */}
            <div className="relative h-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.photo} alt={cat.title} loading="lazy" decoding="async" className="w-full h-full object-cover" style={{ contain: 'strict' }}/>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))' }}/>
                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 pb-6 max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 mb-2 text-[13px] text-white/70">
                        <Link href="/public" className="no-underline text-white/70 hover:text-white transition-colors">Головна</Link>
                        <span className="text-[10px]">{">"}</span>
                        <Link href="/categories" className="no-underline text-white/70 hover:text-white transition-colors">Категорії</Link>
                        <span className="text-[10px]">{">"}</span>
                        {openSub ? (
                            <>
                                <button onClick={() => { setOpenSub(null); setSearch('') }} className="text-white/70 hover:text-white transition-colors">{cat.title}</button>
                                <span className="text-[10px]">›</span>
                                <span className="text-white">{openSub.title}</span>
                            </>
                        ) : (
                            <span className="text-white">{cat.title}</span>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg" style={{ background: 'rgba(255,255,255,0.92)' }}>
                            <Icon size={19} color={cat.accent} strokeWidth={1.8}/>
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white m-0 leading-tight"
                                style={{ fontFamily: 'var(--font-display)' }}>
                                {openSub ? openSub.title : cat.title}
                            </h1>
                            <p className="text-white/60 text-[13px] m-0">
                                {openSub ? openSub.titleEn : cat.titleEn}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <InnerPageLayout sidebar={sidebar} bottomNavItems={bottomNavItems} stickyTop={80}>
                {/* Back button if in subcat */}
                {openSub && (
                    <button
                        onClick={() => { setOpenSub(null); setSearch('') }}
                        className="flex items-center gap-1.5 mb-4 text-[13px] font-semibold transition-colors"
                        style={{ color: 'var(--text-accent)' }}
                    >
                        <ArrowLeft size={14}/> Назад до «{cat.title}»
                    </button>
                )}

                {/* Subcategory cards — only shown when no subcat selected */}
                {!openSub && subcategories.length > 0 && (
                    <div className="mb-6">
                        <p className="text-[12.5px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                            Підкатегорії
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {subcategories.map(sub => {
                                const SubIcon = sub.icon
                                return (
                                    <button
                                        key={sub.id}
                                        onClick={() => { setOpenSub(sub); setSearch('') }}
                                        className="city-card flex items-center gap-4 rounded-2xl shadow-sm px-5 py-4 text-left transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: sub.bg }}>
                                            <SubIcon size={18} color={sub.accent} strokeWidth={1.8}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-[14px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>{sub.title}</p>
                                            <p className="text-[12px] m-0 mt-0.5" style={{ color: 'var(--text-secondary)' }}>{sub.count} ресурсів</p>
                                        </div>
                                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }}/>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Direct resources */}
                {!openSub && cat.items.filter(i => i.type === 'resource').length > 0 && (
                    <p className="text-[12.5px] font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--text-muted)' }}>
                        Ресурси
                    </p>
                )}

                <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
                    Знайдено <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{resources.length}</span> ресурсів
                </p>

                {resources.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center rounded-2xl"
                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>Нічого не знайдено</p>
                        <button onClick={() => setSearch('')} className="mt-3 text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>Скинути</button>
                    </div>
                )}

                {/* GRID */}
                {view === 'grid' && resources.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {resources.map((res) => {
                            const RIcon = res.icon
                            return (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                                   className="anim-in res-grid-card city-card flex flex-col rounded-2xl shadow-sm overflow-hidden no-underline"
                                >
                                    <div className="h-1 opacity-80" style={{ background: res.accent }}/>
                                    <div className="p-5 flex flex-col flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: res.bg }}>
                                                <RIcon size={18} color={res.accent} strokeWidth={1.8}/>
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
                                            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(res.addedAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span className="flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: res.accent }}>
                                                Перейти <ExternalLink size={11}/>
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                )}

                {/* LIST */}
                {view === 'list' && resources.length > 0 && (
                    <div className="flex flex-col gap-2.5">
                        {resources.map((res) => {
                            const RIcon = res.icon
                            return (
                                <a key={res.id} href={res.url} target="_blank" rel="noopener noreferrer"
                                   className="anim-in res-list-item flex items-center gap-4 rounded-2xl shadow-sm px-5 py-4 no-underline"
                                   style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                                    <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: res.accent }}/>
                                    <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                        <RIcon size={18} color={res.accent} strokeWidth={1.8}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-[14px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>{res.title}</p>
                                            {res.isNew && <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Нове</span>}
                                        </div>
                                        <p className="text-[13px] m-0 mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{res.description}</p>
                                    </div>
                                    <ExternalLink size={15} className="list-ext shrink-0" style={{ color: 'var(--text-muted)' }}/>
                                </a>
                            )
                        })}
                    </div>
                )}

                {/* TABLE */}
                {view === 'table' && resources.length > 0 && (
                    <div className="anim-in rounded-2xl shadow-sm overflow-hidden"
                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                        <table className="w-full border-collapse">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Ресурс', 'Опис', 'Додано', ''].map(h => (
                                    <th key={h} className="text-left text-[11.5px] font-semibold uppercase tracking-wide px-5 py-3.5"
                                        style={{ color: 'var(--table-header-text)' }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {resources.map(res => {
                                const RIcon = res.icon
                                return (
                                    <tr key={res.id} className="res-row cursor-pointer" style={{ borderBottom: '1px solid var(--border)' }}
                                        onClick={() => window.open(res.url, '_blank')}>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center" style={{ background: res.bg }}>
                                                    <RIcon size={14} color={res.accent} strokeWidth={1.8}/>
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
                                        <td className="px-4 py-3.5 hidden md:table-cell">
                                            <p className="text-[12.5px] m-0 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>{res.description}</p>
                                        </td>
                                        <td className="px-4 py-3.5 hidden sm:table-cell text-[13px]" style={{ color: 'var(--text-muted)' }}>
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
            </InnerPageLayout>
        </div>
    )
}