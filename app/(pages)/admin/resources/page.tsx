// app/(pages)/admin/resources/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital, Globe,
    Search, X, Plus, Pencil, Trash2, Check,
    ExternalLink, Layers, Hash, AlignLeft,
    Link as LinkIcon, Type, ChevronDown,
    ArrowUpDown, Filter, FolderOpen,
} from 'lucide-react'

/* ─── Icon registry ──────────────────────────────────────────── */
const ICON_OPTIONS: { name: string; icon: React.ElementType }[] = [
    { name: 'Heart',         icon: Heart         },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Building2',     icon: Building2     },
    { name: 'Users',         icon: Users         },
    { name: 'Zap',           icon: Zap           },
    { name: 'Briefcase',     icon: Briefcase     },
    { name: 'Bus',           icon: Bus           },
    { name: 'AlertCircle',   icon: AlertCircle   },
    { name: 'Calendar',      icon: Calendar      },
    { name: 'School',        icon: School        },
    { name: 'Baby',          icon: Baby          },
    { name: 'Hospital',      icon: Hospital      },
    { name: 'Globe',         icon: Globe         },
]
const findIcon = (name: string) => ICON_OPTIONS.find(i => i.name === name)?.icon ?? Heart

/* ─── Types ──────────────────────────────────────────────────── */
interface Subcategory { id: string; title: string; titleEn: string }
interface Resource {
    id: string; title: string; description: string
    url: string; subcategoryId: string | null; tags: string[]; createdAt: string
}
interface Category {
    id: string; title: string; titleEn: string
    iconName: string; accent: string; bg: string
    services: string[]; subcategories: Subcategory[]; resources: Resource[]
    createdAt: string
}

/* ─── Flat resource with category info ──────────────────────── */
interface FlatResource extends Resource {
    categoryId:    string
    categoryTitle: string
    categoryAccent:string
    categoryBg:    string
    categoryIcon:  string
    subcategoryTitle: string | null
}

/* ─── Mock data ──────────────────────────────────────────────── */
const INITIAL_CATEGORIES: Category[] = [
    {
        id: 'health', title: "Здоров'я", titleEn: 'Health', iconName: 'Heart',
        accent: '#ef4444', bg: '#fef2f2',
        services: ['Лікарні', 'Поліклініки', 'Аптеки'],
        subcategories: [
            { id: 'hospitals-sub', title: 'Лікарні',  titleEn: 'Hospitals'  },
            { id: 'pharmacies',    title: 'Аптеки',   titleEn: 'Pharmacies' },
        ],
        resources: [
            { id: 'r1', title: 'Черкаська обласна лікарня', description: 'Головний медичний заклад Черкаської області', url: 'https://oblhos.ck.ua',    subcategoryId: 'hospitals-sub', tags: ['лікарня', 'стаціонар'], createdAt: '2025-01-10' },
            { id: 'r2', title: 'Міська лікарня №1',         description: 'Многопрофільна міська лікарня',               url: 'https://hospital1.ck.ua', subcategoryId: 'hospitals-sub', tags: ['лікарня'],             createdAt: '2025-01-12' },
            { id: 'r3', title: 'Довідник аптек Черкас',     description: 'Список аптек з адресами та графіком',          url: 'https://apteka.ck.ua',    subcategoryId: 'pharmacies',    tags: ['аптека', 'ліки'],      createdAt: '2025-01-15' },
            { id: 'r4', title: 'Запис до лікаря онлайн',    description: 'Портал онлайн-запису до лікарів',              url: 'https://helsi.me',        subcategoryId: null,            tags: ['запис', 'онлайн'],     createdAt: '2025-02-01' },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'education', title: 'Освіта', titleEn: 'Education', iconName: 'GraduationCap',
        accent: '#3b82f6', bg: '#eff6ff',
        services: ['Школи', 'Університети'],
        subcategories: [
            { id: 'schools-sub',  title: 'Школи',        titleEn: 'Schools'      },
            { id: 'universities', title: 'Університети', titleEn: 'Universities' },
        ],
        resources: [
            { id: 'r5', title: 'ЧНУ ім. Хмельницького', description: 'Офіційний сайт університету', url: 'https://cnu.edu.ua',  subcategoryId: 'universities', tags: ['університет', 'вища освіта'], createdAt: '2025-01-05' },
            { id: 'r6', title: 'НВК №1',                 description: 'Навчально-виховний комплекс', url: 'https://nvk1.ck.ua',  subcategoryId: 'schools-sub',  tags: ['школа'],                    createdAt: '2025-01-20' },
            { id: 'r7', title: 'Черкаська бібліотека',   description: 'Міська публічна бібліотека',  url: 'https://library.ck.ua',subcategoryId: null,           tags: ['бібліотека'],               createdAt: '2025-02-10' },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'council', title: 'Міська Рада', titleEn: 'City Council', iconName: 'Building2',
        accent: '#f59e0b', bg: '#fffbeb',
        services: ['Документи', 'Дозволи'],
        subcategories: [{ id: 'docs', title: 'Документи', titleEn: 'Documents' }],
        resources: [
            { id: 'r8', title: 'Сайт міської ради',   description: 'Новини та рішення ради',         url: 'https://mrada.ck.ua',   subcategoryId: null,   tags: ['рада', 'офіційно'], createdAt: '2024-11-01' },
            { id: 'r9', title: 'Портал держпослуг',   description: 'Онлайн держпослуги для громадян', url: 'https://diia.gov.ua',   subcategoryId: 'docs', tags: ['документи', 'дія'], createdAt: '2024-11-10' },
        ],
        createdAt: '2024-10-20',
    },
    {
        id: 'utilities', title: 'Комунальні Послуги', titleEn: 'Utilities', iconName: 'Zap',
        accent: '#10b981', bg: '#ecfdf5',
        services: ['Вода', 'Електрика'],
        subcategories: [
            { id: 'water',       title: 'Водопостачання',    titleEn: 'Water'       },
            { id: 'electricity', title: 'Електропостачання', titleEn: 'Electricity' },
        ],
        resources: [
            { id: 'r10', title: 'Черкасиводоканал',    description: 'Водопостачання та водовідведення', url: 'https://vodokanal.ck.ua', subcategoryId: 'water',       tags: ['вода'],       createdAt: '2024-12-10' },
            { id: 'r11', title: 'Черкасиенерго',       description: 'Постачання електроенергії',        url: 'https://energy.ck.ua',   subcategoryId: 'electricity', tags: ['електрика'],  createdAt: '2024-12-15' },
        ],
        createdAt: '2024-11-05',
    },
    {
        id: 'transport', title: 'Транспорт', titleEn: 'Transport', iconName: 'Bus',
        accent: '#f97316', bg: '#fff7ed',
        services: ['Розклад', 'Парковка'],
        subcategories: [{ id: 'buses', title: 'Автобуси', titleEn: 'Buses' }],
        resources: [
            { id: 'r12', title: 'Розклад маршрутів', description: 'Актуальний розклад транспорту', url: 'https://marshrutky.ck.ua', subcategoryId: 'buses', tags: ['маршрут', 'розклад'], createdAt: '2025-01-08' },
        ],
        createdAt: '2024-11-15',
    },
    {
        id: 'social', title: 'Соціальні Послуги', titleEn: 'Social Services', iconName: 'Users',
        accent: '#8b5cf6', bg: '#f5f3ff',
        services: ['Допомога', 'Пільги'],
        subcategories: [],
        resources: [
            { id: 'r13', title: 'Центр соціальних послуг', description: 'Соціальна підтримка населення', url: 'https://social.ck.ua', subcategoryId: null, tags: ['соціальний', 'допомога'], createdAt: '2025-01-25' },
        ],
        createdAt: '2024-11-01',
    },
]

/* ─── Shared styles ──────────────────────────────────────────── */
const inputCls = 'w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-blue-500/30'
const inputSt: React.CSSProperties = {
    background: 'var(--admin-stat-bg)',
    border: '1px solid var(--admin-stat-border)',
    color: 'var(--text-primary)',
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function AdminResourcesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)

    const [search,      setSearch]      = useState('')
    const [filterCatId, setFilterCatId] = useState<string | null>(null)
    const [sortBy,      setSortBy]      = useState<'title' | 'category' | 'createdAt'>('createdAt')
    const [sortDir,     setSortDir]     = useState<'asc' | 'desc'>('desc')
    const [showFilters, setShowFilters] = useState(false)

    const [showAddForm,  setShowAddForm]  = useState(false)
    const [editRes,      setEditRes]      = useState<FlatResource | null>(null)
    const [moveRes,      setMoveRes]      = useState<FlatResource | null>(null)
    const [deleteRes,    setDeleteRes]    = useState<FlatResource | null>(null)

    /* ── flatten all resources ── */
    const allResources = useMemo<FlatResource[]>(() => {
        return categories.flatMap(cat =>
            cat.resources.map(r => {
                const sub = cat.subcategories.find(s => s.id === r.subcategoryId)
                return {
                    ...r,
                    categoryId:       cat.id,
                    categoryTitle:    cat.title,
                    categoryAccent:   cat.accent,
                    categoryBg:       cat.bg,
                    categoryIcon:     cat.iconName,
                    subcategoryTitle: sub?.title ?? null,
                }
            })
        )
    }, [categories])

    /* ── filtered + sorted ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        const list = allResources.filter(r => {
            const matchSearch = !q ||
                r.title.toLowerCase().includes(q) ||
                r.description.toLowerCase().includes(q) ||
                r.categoryTitle.toLowerCase().includes(q) ||
                r.tags.some(t => t.toLowerCase().includes(q))
            const matchCat = !filterCatId || r.categoryId === filterCatId
            return matchSearch && matchCat
        })
        list.sort((a, b) => {
            let cmp = 0
            if (sortBy === 'title')     cmp = a.title.localeCompare(b.title, 'uk')
            if (sortBy === 'category')  cmp = a.categoryTitle.localeCompare(b.categoryTitle, 'uk')
            if (sortBy === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            return sortDir === 'asc' ? cmp : -cmp
        })
        return list
    }, [allResources, search, filterCatId, sortBy, sortDir])

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortBy(col); setSortDir('asc') }
    }

    /* ── mutators ── */
    const addResource = (catId: string, r: Omit<Resource, 'id' | 'createdAt'>) => {
        setCategories(prev => prev.map(c => c.id !== catId ? c : {
            ...c,
            resources: [...c.resources, { ...r, id: 'r-' + Date.now(), createdAt: new Date().toISOString().split('T')[0] }]
        }))
        setShowAddForm(false)
    }

    const saveEdit = (updated: FlatResource) => {
        setCategories(prev => prev.map(c => c.id !== updated.categoryId ? c : {
            ...c,
            resources: c.resources.map(r => r.id !== updated.id ? r : {
                id: updated.id, title: updated.title, description: updated.description,
                url: updated.url, subcategoryId: updated.subcategoryId,
                tags: updated.tags, createdAt: updated.createdAt,
            })
        }))
        setEditRes(null)
    }

    const moveResource = (res: FlatResource, newCatId: string, newSubId: string | null) => {
        setCategories(prev => {
            // remove from old category
            const withRemoved = prev.map(c => c.id !== res.categoryId ? c : {
                ...c, resources: c.resources.filter(r => r.id !== res.id)
            })
            // add to new category
            return withRemoved.map(c => c.id !== newCatId ? c : {
                ...c,
                resources: [...c.resources, {
                    id: res.id, title: res.title, description: res.description,
                    url: res.url, subcategoryId: newSubId,
                    tags: res.tags, createdAt: res.createdAt,
                }]
            })
        })
        setMoveRes(null)
    }

    const deleteResource = (res: FlatResource) => {
        setCategories(prev => prev.map(c => c.id !== res.categoryId ? c : {
            ...c, resources: c.resources.filter(r => r.id !== res.id)
        }))
        setDeleteRes(null)
    }

    return (
        <div className="max-w-[1400px] mx-auto">

            {/* ── Header ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span><span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Ресурси</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                            Всі ресурси
                        </h1>
                        <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {allResources.length} ресурсів у {categories.length} категоріях
                        </p>
                    </div>
                    <button onClick={() => { setShowAddForm(true); setEditRes(null) }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.97]"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)', boxShadow: '0 2px 12px rgba(59,130,246,.3)' }}>
                        <Plus size={16} /> Додати ресурс
                    </button>
                </div>
            </div>

            {/* ── Stats by category ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
                {categories.filter(c => c.resources.length > 0).map(cat => {
                    const Icon = findIcon(cat.iconName)
                    const active = filterCatId === cat.id
                    return (
                        <button key={cat.id}
                                onClick={() => setFilterCatId(active ? null : cat.id)}
                                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                                style={{
                                    background: active ? cat.bg : 'var(--admin-stat-bg)',
                                    border: `1px solid ${active ? cat.accent + '55' : 'var(--admin-stat-border)'}`,
                                }}>
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                                 style={{ background: active ? cat.accent + '25' : cat.bg }}>
                                <Icon size={12} color={cat.accent} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold m-0 truncate"
                                   style={{ color: active ? cat.accent : 'var(--text-primary)' }}>
                                    {cat.title}
                                </p>
                                <p className="text-[10px] m-0" style={{ color: active ? cat.accent + 'aa' : 'var(--text-muted)' }}>
                                    {cat.resources.length} ресурсів
                                </p>
                            </div>
                        </button>
                    )
                })}
            </div>

            {/* ── Search + sort toolbar ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                {/* Search */}
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 flex-1"
                     style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                    <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input type="text" placeholder="Пошук по назві, опису, тегам, категорії..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           className="flex-1 bg-transparent text-[13.5px] outline-none"
                           style={{ color: 'var(--text-primary)' }} />
                    {search && <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}><X size={14} /></button>}
                </div>
                {/* Sort */}
                <div className="flex gap-2">
                    {([
                        { col: 'createdAt' as const, label: 'Дата'      },
                        { col: 'title'     as const, label: 'Назва'     },
                        { col: 'category'  as const, label: 'Категорія' },
                    ]).map(s => (
                        <button key={s.col} onClick={() => toggleSort(s.col)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={sortBy === s.col
                                    ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)', border: '1px solid var(--admin-badge-border)' }
                                    : { background: 'var(--admin-stat-bg)', color: 'var(--text-muted)', border: '1px solid var(--admin-stat-border)' }}>
                            <ArrowUpDown size={12} />{s.label}
                            {sortBy === s.col && <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Add / Edit form (inline, above table) ── */}
            {(showAddForm || editRes) && (
                <div className="rounded-2xl mb-5 overflow-hidden"
                     style={{ border: `1.5px solid #3b82f655`, background: 'var(--admin-stat-bg)' }}>
                    <div className="px-6 py-4 flex items-center justify-between"
                         style={{ borderBottom: '1px solid var(--border)' }}>
                        <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                            {editRes ? `Редагувати: ${editRes.title}` : 'Новий ресурс'}
                        </p>
                        <button onClick={() => { setShowAddForm(false); setEditRes(null) }}
                                className="w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ color: 'var(--text-muted)' }}>
                            <X size={16} />
                        </button>
                    </div>
                    <div className="px-6 py-5">
                        <ResourceForm
                            resource={editRes ?? undefined}
                            categories={categories}
                            onSave={(catId, r) => {
                                if (editRes) {
                                    saveEdit({ ...editRes, ...r, categoryId: catId })
                                } else {
                                    addResource(catId, r)
                                }
                            }}
                            onCancel={() => { setShowAddForm(false); setEditRes(null) }}
                        />
                    </div>
                </div>
            )}

            {/* ── Table ── */}
            <div className="rounded-2xl overflow-hidden"
                 style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            {['Ресурс', 'Категорія', 'Підкатегорія', 'Теги', 'Додано', ''].map(h => (
                                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3.5"
                                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-16">
                                <p className="text-3xl mb-2">🔍</p>
                                <p className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Нічого не знайдено</p>
                                <button onClick={() => { setSearch(''); setFilterCatId(null) }}
                                        className="text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>
                                    Скинути фільтри
                                </button>
                            </td></tr>
                        )}
                        {filtered.map(res => {
                            const CatIcon = findIcon(res.categoryIcon)
                            return (
                                <tr key={res.id} className="transition-colors group"
                                    style={{ borderBottom: '1px solid var(--border)' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                                    {/* Resource */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                                 style={{ background: res.categoryBg }}>
                                                <LinkIcon size={13} color={res.categoryAccent} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-semibold text-[13px] m-0 truncate" style={{ color: 'var(--text-primary)' }}>
                                                        {res.title}
                                                    </p>
                                                    <a href={res.url} target="_blank" rel="noopener noreferrer"
                                                       className="opacity-0 group-hover:opacity-50 transition-opacity shrink-0"
                                                       style={{ color: res.categoryAccent }}>
                                                        <ExternalLink size={11} />
                                                    </a>
                                                </div>
                                                {res.description && (
                                                    <p className="text-[11.5px] m-0 truncate max-w-[240px]" style={{ color: 'var(--text-muted)' }}>
                                                        {res.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-3.5">
                                        <button onClick={() => router.push(`/admin/categories/${res.categoryId}`)}
                                                className="flex items-center gap-1.5 transition-opacity hover:opacity-70">
                                            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                                 style={{ background: res.categoryBg }}>
                                                <CatIcon size={10} color={res.categoryAccent} />
                                            </div>
                                            <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                                    {res.categoryTitle}
                                                </span>
                                        </button>
                                    </td>

                                    {/* Subcategory */}
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        {res.subcategoryTitle ? (
                                            <span className="inline-flex items-center gap-1 text-[11.5px] font-medium px-2 py-0.5 rounded-full"
                                                  style={{ background: res.categoryBg, color: res.categoryAccent }}>
                                                    <Layers size={9} />{res.subcategoryTitle}
                                                </span>
                                        ) : (
                                            <span className="text-[11.5px]" style={{ color: 'var(--text-muted)' }}>—</span>
                                        )}
                                    </td>

                                    {/* Tags */}
                                    <td className="px-5 py-3.5 hidden lg:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {res.tags.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-md"
                                                      style={{ background: res.categoryAccent + '12', color: res.categoryAccent }}>
                                                        #{tag}
                                                    </span>
                                            ))}
                                            {res.tags.length > 2 && (
                                                <span className="text-[10.5px]" style={{ color: 'var(--text-muted)' }}>+{res.tags.length - 2}</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(res.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Edit */}
                                            <button onClick={() => { setEditRes(res); setShowAddForm(false) }}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                                    style={{ color: 'var(--text-muted)' }}
                                                    title="Редагувати"
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <Pencil size={13} />
                                            </button>
                                            {/* Move */}
                                            <button onClick={() => setMoveRes(res)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                                    style={{ color: 'var(--text-muted)' }}
                                                    title="Перемістити до іншої категорії"
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <FolderOpen size={13} />
                                            </button>
                                            {/* Delete */}
                                            <button onClick={() => setDeleteRes(res)}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                                    style={{ color: 'var(--admin-danger-text)' }}
                                                    title="Видалити"
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>
                        Показано {filtered.length} з {allResources.length} ресурсів
                        {filterCatId && <> · <button onClick={() => setFilterCatId(null)} className="underline ml-1">зняти фільтр</button></>}
                    </p>
                </div>
            </div>

            {/* ── Move modal ── */}
            {moveRes && (
                <MoveModal
                    resource={moveRes}
                    categories={categories}
                    onMove={moveResource}
                    onClose={() => setMoveRes(null)}
                />
            )}

            {/* ── Delete confirm ── */}
            {deleteRes && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }}
                     onClick={e => { if (e.target === e.currentTarget) setDeleteRes(null) }}>
                    <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                             style={{ background: 'var(--admin-danger-bg)' }}>
                            <Trash2 size={24} style={{ color: 'var(--admin-danger-text)' }} />
                        </div>
                        <p className="font-bold text-[17px] mb-2" style={{ color: 'var(--text-primary)' }}>Видалити ресурс?</p>
                        <p className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-secondary)' }}>{deleteRes.title}</p>
                        <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>Цю дію неможливо скасувати.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteRes(null)}
                                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                                    style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                                Скасувати
                            </button>
                            <button onClick={() => deleteResource(deleteRes)}
                                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90"
                                    style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)' }}>
                                Видалити
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   RESOURCE FORM (add + edit)
   ═══════════════════════════════════════════════════════════════ */
function ResourceForm({ resource, categories, onSave, onCancel }: {
    resource?:  FlatResource
    categories: Category[]
    onSave:     (catId: string, r: Omit<Resource, 'id' | 'createdAt'>) => void
    onCancel:   () => void
}) {
    const [catId,         setCatId]         = useState(resource?.categoryId      ?? categories[0]?.id ?? '')
    const [title,         setTitle]         = useState(resource?.title            ?? '')
    const [description,   setDescription]   = useState(resource?.description      ?? '')
    const [url,           setUrl]           = useState(resource?.url              ?? '')
    const [subcategoryId, setSubcategoryId] = useState<string | null>(resource?.subcategoryId ?? null)
    const [tags,          setTags]          = useState(resource?.tags.join(', ')  ?? '')

    const selectedCat = categories.find(c => c.id === catId)
    const accent = selectedCat?.accent ?? '#3b82f6'

    // reset subcategory when category changes
    const handleCatChange = (id: string) => {
        setCatId(id)
        setSubcategoryId(null)
    }

    const save = () => {
        if (!title.trim() || !url.trim() || !catId) return
        onSave(catId, {
            title:       title.trim(),
            description: description.trim(),
            url:         url.trim(),
            subcategoryId,
            tags:        tags.split(',').map(t => t.trim()).filter(Boolean),
        })
    }

    return (
        <div className="space-y-4">
            {/* Category selector */}
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                    <FolderOpen size={9} className="inline mr-1" />Категорія *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {categories.map(cat => {
                        const Icon = findIcon(cat.iconName)
                        const active = catId === cat.id
                        return (
                            <button key={cat.id} type="button" onClick={() => handleCatChange(cat.id)}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                                    style={{
                                        background: active ? cat.bg : 'var(--admin-stat-bg)',
                                        border: `1px solid ${active ? cat.accent + '66' : 'var(--admin-stat-border)'}`,
                                    }}>
                                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ background: cat.bg }}>
                                    <Icon size={11} color={cat.accent} />
                                </div>
                                <span className="text-[12px] font-medium truncate"
                                      style={{ color: active ? cat.accent : 'var(--text-secondary)' }}>
                                    {cat.title}
                                </span>
                                {active && <Check size={11} className="ml-auto shrink-0" style={{ color: cat.accent }} />}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                        <Type size={9} className="inline mr-1" />Назва *
                    </label>
                    <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                           placeholder="Назва ресурсу" className={inputCls} style={inputSt} />
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                        <LinkIcon size={9} className="inline mr-1" />URL *
                    </label>
                    <input value={url} onChange={e => setUrl(e.target.value)}
                           placeholder="https://example.com" className={inputCls} style={inputSt} />
                </div>
            </div>

            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                    <AlignLeft size={9} className="inline mr-1" />Опис
                </label>
                <input value={description} onChange={e => setDescription(e.target.value)}
                       placeholder="Короткий опис ресурсу" className={inputCls} style={inputSt} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                        <Layers size={9} className="inline mr-1" />Підкатегорія
                    </label>
                    <select value={subcategoryId ?? ''} onChange={e => setSubcategoryId(e.target.value || null)}
                            className={inputCls} style={{ ...inputSt, paddingTop: '10px', paddingBottom: '10px' }}>
                        <option value="">— Напряму в категорії —</option>
                        {(selectedCat?.subcategories ?? []).map(s => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                        <Hash size={9} className="inline mr-1" />Теги (через кому)
                    </label>
                    <input value={tags} onChange={e => setTags(e.target.value)}
                           placeholder="лікарня, стаціонар" className={inputCls} style={inputSt} />
                </div>
            </div>

            <div className="flex gap-3 justify-end pt-1">
                <button onClick={onCancel}
                        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    Скасувати
                </button>
                <button onClick={save} disabled={!title.trim() || !url.trim() || !catId}
                        className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 transition-all"
                        style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
                    <Check size={13} className="inline mr-1.5" />
                    {resource ? 'Зберегти зміни' : 'Додати ресурс'}
                </button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   MOVE MODAL
   ═══════════════════════════════════════════════════════════════ */
function MoveModal({ resource, categories, onMove, onClose }: {
    resource:   FlatResource
    categories: Category[]
    onMove:     (res: FlatResource, newCatId: string, newSubId: string | null) => void
    onClose:    () => void
}) {
    const [newCatId, setNewCatId] = useState(resource.categoryId)
    const [newSubId, setNewSubId] = useState<string | null>(resource.subcategoryId)

    const selectedCat = categories.find(c => c.id === newCatId)
    const changed = newCatId !== resource.categoryId || newSubId !== resource.subcategoryId

    const handleCatChange = (id: string) => {
        setNewCatId(id)
        setNewSubId(null)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4"
                     style={{ borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <p className="font-semibold text-[15px] m-0" style={{ color: 'var(--text-primary)' }}>
                            Перемістити ресурс
                        </p>
                        <p className="text-[12px] m-0 mt-0.5 truncate max-w-[280px]" style={{ color: 'var(--text-muted)' }}>
                            {resource.title}
                        </p>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg"
                            style={{ color: 'var(--text-muted)' }}>
                        <X size={16} />
                    </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                    {/* Category grid */}
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                            Оберіть категорію
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {categories.map(cat => {
                                const Icon = findIcon(cat.iconName)
                                const active = newCatId === cat.id
                                const isCurrent = cat.id === resource.categoryId
                                return (
                                    <button key={cat.id} onClick={() => handleCatChange(cat.id)}
                                            className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-left transition-all relative"
                                            style={{
                                                background: active ? cat.bg : 'var(--admin-stat-bg)',
                                                border: `1px solid ${active ? cat.accent + '66' : 'var(--admin-stat-border)'}`,
                                            }}>
                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                             style={{ background: active ? cat.accent + '25' : cat.bg }}>
                                            <Icon size={13} color={cat.accent} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12.5px] font-semibold m-0 truncate"
                                               style={{ color: active ? cat.accent : 'var(--text-primary)' }}>
                                                {cat.title}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-[10px] m-0" style={{ color: 'var(--text-muted)' }}>поточна</p>
                                            )}
                                        </div>
                                        {active && <Check size={13} className="ml-auto shrink-0" style={{ color: cat.accent }} />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Subcategory */}
                    {selectedCat && selectedCat.subcategories.length > 0 && (
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
                                Підкатегорія
                            </p>
                            <div className="space-y-1.5">
                                <button onClick={() => setNewSubId(null)}
                                        className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-left transition-all"
                                        style={{
                                            background: newSubId === null ? selectedCat.bg : 'var(--admin-stat-bg)',
                                            border: `1px solid ${newSubId === null ? selectedCat.accent + '55' : 'var(--admin-stat-border)'}`,
                                        }}>
                                    <Globe size={13} style={{ color: newSubId === null ? selectedCat.accent : 'var(--text-muted)' }} />
                                    <span className="text-[12.5px] font-medium"
                                          style={{ color: newSubId === null ? selectedCat.accent : 'var(--text-secondary)' }}>
                                        Напряму в категорії
                                    </span>
                                    {newSubId === null && <Check size={12} className="ml-auto" style={{ color: selectedCat.accent }} />}
                                </button>
                                {selectedCat.subcategories.map(sub => (
                                    <button key={sub.id} onClick={() => setNewSubId(sub.id)}
                                            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-left transition-all"
                                            style={{
                                                background: newSubId === sub.id ? selectedCat.bg : 'var(--admin-stat-bg)',
                                                border: `1px solid ${newSubId === sub.id ? selectedCat.accent + '55' : 'var(--admin-stat-border)'}`,
                                            }}>
                                        <Layers size={13} style={{ color: newSubId === sub.id ? selectedCat.accent : 'var(--text-muted)' }} />
                                        <span className="text-[12.5px] font-medium"
                                              style={{ color: newSubId === sub.id ? selectedCat.accent : 'var(--text-secondary)' }}>
                                            {sub.title}
                                        </span>
                                        {newSubId === sub.id && <Check size={12} className="ml-auto" style={{ color: selectedCat.accent }} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                            style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        Скасувати
                    </button>
                    <button onClick={() => onMove(resource, newCatId, newSubId)}
                            disabled={!changed}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                        <Check size={13} className="inline mr-1.5" /> Перемістити
                    </button>
                </div>
            </div>
        </div>
    )
}