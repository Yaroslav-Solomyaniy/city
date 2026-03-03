'use client'

import React, { useState, useMemo } from 'react'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital,
    Search, X, Plus, Pencil, Trash2, Eye,
    ChevronDown, ArrowUpDown, MoreHorizontal,
    Image as ImageIcon, Palette, Type, Globe,
    Check, Layers, FolderOpen,
} from 'lucide-react'

/* ─── Icon registry ──────────────────────────────────────────── */
const ICON_OPTIONS: { name: string; icon: React.ElementType }[] = [
    { name: 'Heart',         icon: Heart },
    { name: 'GraduationCap', icon: GraduationCap },
    { name: 'Building2',     icon: Building2 },
    { name: 'Users',         icon: Users },
    { name: 'Zap',           icon: Zap },
    { name: 'Briefcase',     icon: Briefcase },
    { name: 'Bus',           icon: Bus },
    { name: 'AlertCircle',   icon: AlertCircle },
    { name: 'Calendar',      icon: Calendar },
    { name: 'School',        icon: School },
    { name: 'Baby',          icon: Baby },
    { name: 'Hospital',      icon: Hospital },
    { name: 'Globe',         icon: Globe },
]

const findIcon = (name: string) => ICON_OPTIONS.find(i => i.name === name)?.icon ?? Heart

/* ─── Types ──────────────────────────────────────────────────── */
interface Subcategory {
    id:      string
    title:   string
    titleEn: string
}

interface Category {
    id:            string
    title:         string
    titleEn:       string
    iconName:      string
    photo:         string
    accent:        string
    bg:            string
    services:      string[]
    subcategories: Subcategory[]
    createdAt:     string
}

/* ─── Data ───────────────────────────────────────────────────── */
const initialCategories: Category[] = [
    { id: 'health',        title: "Здоров'я",          titleEn: 'Health',          iconName: 'Heart',         photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=50', accent: '#ef4444', bg: '#fef2f2', services: ['Лікарні', 'Поліклініки', 'Аптеки', 'Лабораторії'], subcategories: [{ id: 'hospitals-sub', title: 'Лікарні', titleEn: 'Hospitals' }, { id: 'pharmacies', title: 'Аптеки', titleEn: 'Pharmacies' }], createdAt: '2024-10-15' },
    { id: 'education',     title: 'Освіта',             titleEn: 'Education',       iconName: 'GraduationCap', photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=50', accent: '#3b82f6', bg: '#eff6ff', services: ['Школи', 'Університети', 'Бібліотеки', 'Курси'],      subcategories: [{ id: 'schools-sub', title: 'Школи', titleEn: 'Schools' }, { id: 'universities', title: 'Університети', titleEn: 'Universities' }], createdAt: '2024-10-15' },
    { id: 'council',       title: 'Міська Рада',        titleEn: 'City Council',    iconName: 'Building2',     photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=50', accent: '#f59e0b', bg: '#fffbeb', services: ['Документи', 'Дозволи', 'Реєстрація', 'Петиції'],     subcategories: [{ id: 'docs', title: 'Документи', titleEn: 'Documents' }], createdAt: '2024-10-20' },
    { id: 'social',        title: 'Соціальні Послуги',  titleEn: 'Social Services', iconName: 'Users',         photo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=50', accent: '#8b5cf6', bg: '#f5f3ff', services: ['Допомога', 'Пільги', 'Субсидії', 'Підтримка'],       subcategories: [], createdAt: '2024-11-01' },
    { id: 'utilities',     title: 'Комунальні Послуги', titleEn: 'Utilities',       iconName: 'Zap',           photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=50', accent: '#10b981', bg: '#ecfdf5', services: ['Вода', 'Електрика', 'Газ', 'Опалення'],              subcategories: [{ id: 'water', title: 'Водопостачання', titleEn: 'Water' }, { id: 'electricity', title: 'Електропостачання', titleEn: 'Electricity' }], createdAt: '2024-11-05' },
    { id: 'business',      title: 'Бізнес',             titleEn: 'Business',        iconName: 'Briefcase',     photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=50', accent: '#06b6d4', bg: '#ecfeff', services: ['Ліцензії', 'Реєстрація', 'Підтримка', 'Звіти'],      subcategories: [], createdAt: '2024-11-10' },
    { id: 'transport',     title: 'Транспорт',          titleEn: 'Transport',       iconName: 'Bus',           photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=50', accent: '#f97316', bg: '#fff7ed', services: ['Розклад', 'Парковка', 'Дороги', 'Права'],            subcategories: [{ id: 'buses', title: 'Автобуси', titleEn: 'Buses' }], createdAt: '2024-11-15' },
    { id: 'emergency',     title: 'Екстрені Служби',    titleEn: 'Emergency',       iconName: 'AlertCircle',   photo: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&q=50', accent: '#dc2626', bg: '#fef2f2', services: ['Пожежна', 'Поліція', 'Швидка', 'ДСНС'],              subcategories: [], createdAt: '2024-11-20' },
    { id: 'appointments',  title: 'Онлайн Запис',       titleEn: 'Appointments',    iconName: 'Calendar',      photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=50', accent: '#14b8a6', bg: '#f0fdfa', services: ['Лікарі', 'Документи', 'Консультації', 'Прийом'],      subcategories: [], createdAt: '2024-12-01' },
    { id: 'schools',       title: 'Школи',              titleEn: 'Schools',         iconName: 'School',        photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=50', accent: '#6366f1', bg: '#eef2ff', services: ['Початкові', 'Середні', 'Ліцеї', 'Гімназії'],         subcategories: [{ id: 'primary', title: 'Початкові', titleEn: 'Primary' }, { id: 'secondary', title: 'Середні', titleEn: 'Secondary' }], createdAt: '2024-12-10' },
    { id: 'kindergartens', title: 'Дитячі Садки',       titleEn: 'Kindergartens',   iconName: 'Baby',          photo: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?w=400&q=50', accent: '#ec4899', bg: '#fdf2f8', services: ['Державні', 'Приватні', 'Запис', 'Черга'],              subcategories: [], createdAt: '2025-01-05' },
    { id: 'hospitals',     title: 'Медичні Заклади',    titleEn: 'Medical',         iconName: 'Hospital',      photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=50', accent: '#2563eb', bg: '#eff6ff', services: ['Стаціонари', 'Амбулаторії', 'Центри', 'Диспансери'],  subcategories: [{ id: 'inpatient', title: 'Стаціонари', titleEn: 'Inpatient' }, { id: 'outpatient', title: 'Амбулаторії', titleEn: 'Outpatient' }], createdAt: '2025-01-15' },
]

/* ─── Shared form styles ─────────────────────────────────────── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 focus:ring-2 focus:ring-blue-500/40'
const inputSt: React.CSSProperties = { background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-primary)' }
const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5'

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>(initialCategories)
    const [search,  setSearch]  = useState('')
    const [sortBy,  setSortBy]  = useState<'title' | 'count' | 'createdAt'>('title')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

    const [showAdd,    setShowAdd]    = useState(false)
    const [editItem,   setEditItem]   = useState<Category | null>(null)
    const [deleteItem, setDeleteItem] = useState<Category | null>(null)
    const [viewItem,   setViewItem]   = useState<Category | null>(null)
    const [openMenu,   setOpenMenu]   = useState<string | null>(null)

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        const list = categories.filter(c =>
            !q || c.title.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q) ||
            c.services.some(s => s.toLowerCase().includes(q))
        )
        list.sort((a, b) => {
            let cmp = 0
            if (sortBy === 'title')     cmp = a.title.localeCompare(b.title, 'uk')
            if (sortBy === 'count')     cmp = a.subcategories.length - b.subcategories.length
            if (sortBy === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            return sortDir === 'asc' ? cmp : -cmp
        })
        return list
    }, [categories, search, sortBy, sortDir])

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortBy(col); setSortDir('asc') }
    }

    const handleAdd = (cat: Omit<Category, 'id' | 'createdAt'>) => {
        const id = cat.title.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/g, '-').replace(/-+$/, '')
        setCategories(prev => [...prev, { ...cat, id, createdAt: new Date().toISOString().split('T')[0] }])
        setShowAdd(false)
    }

    const handleEdit = (cat: Category) => {
        setCategories(prev => prev.map(c => c.id === cat.id ? cat : c))
        setEditItem(null)
        if (viewItem?.id === cat.id) setViewItem(cat)
    }

    const handleDelete = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id))
        setDeleteItem(null)
    }

    const handleSubcategoryUpdate = (catId: string, subcategories: Subcategory[]) => {
        setCategories(prev => prev.map(c => c.id === catId ? { ...c, subcategories } : c))
        setViewItem(prev => prev?.id === catId ? { ...prev, subcategories } : prev)
    }

    const totalSubcategories = categories.reduce((s, c) => s + c.subcategories.length, 0)

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* ── Header ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span>
                    <span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Категорії</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                            Управління категоріями
                        </h1>
                        <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {categories.length} категорій · {totalSubcategories} підкатегорій
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAdd(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-[0.97] shrink-0"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', boxShadow: '0 2px 12px rgba(59,130,246,0.3)' }}
                    >
                        <Plus size={16} /> Додати категорію
                    </button>
                </div>
            </div>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Всього категорій',  value: categories.length,  accent: '#3b82f6' },
                    { label: 'Підкатегорій',       value: totalSubcategories, accent: '#10b981' },
                    { label: 'Середня кількість',  value: Math.round(totalSubcategories / Math.max(categories.length, 1)), accent: '#8b5cf6' },
                    { label: 'Остання зміна',      value: 'Сьогодні',         accent: '#f59e0b' },
                ].map(s => (
                    <div key={s.label} className="rounded-xl px-4 py-3"
                         style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        <p className="text-[20px] font-bold m-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{s.value}</p>
                        <p className="text-[11.5px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Search + filters ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 flex-1"
                     style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                    <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        type="text" placeholder="Пошук категорій..."
                        value={search} onChange={e => setSearch(e.target.value)}
                        className="flex-1 bg-transparent text-[13.5px] outline-none"
                        style={{ color: 'var(--text-primary)' }}
                    />
                    {search && (
                        <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}>
                            <X size={14} />
                        </button>
                    )}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { col: 'title'     as const, label: 'За назвою' },
                        { col: 'count'     as const, label: 'За підкатегоріями' },
                        { col: 'createdAt' as const, label: 'За датою' },
                    ].map(s => (
                        <button
                            key={s.col}
                            onClick={() => toggleSort(s.col)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-150"
                            style={sortBy === s.col
                                ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)', border: '1px solid var(--admin-badge-border)' }
                                : { background: 'var(--admin-stat-bg)', color: 'var(--text-muted)', border: '1px solid var(--admin-stat-border)' }
                            }
                        >
                            <ArrowUpDown size={12} />
                            {s.label}
                            {sortBy === s.col && <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-2xl overflow-hidden"
                 style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[700px]">
                        <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            {['Категорія', 'Послуги', 'Підкатегорії', 'Створено', 'Дії'].map(h => (
                                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3.5"
                                    style={{ color: 'var(--text-muted)' }}>
                                    {h}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-16">
                                    <p className="text-3xl mb-2">🔍</p>
                                    <p className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Нічого не знайдено</p>
                                    <button onClick={() => setSearch('')} className="text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>
                                        Скинути пошук
                                    </button>
                                </td>
                            </tr>
                        )}
                        {filtered.map(cat => {
                            const Icon = findIcon(cat.iconName)
                            return (
                                <tr
                                    key={cat.id}
                                    className="transition-colors"
                                    style={{ borderBottom: '1px solid var(--border)' }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                >
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                                                 style={{ background: cat.bg }}>
                                                <Icon size={16} color={cat.accent} strokeWidth={1.8} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-[13.5px] m-0 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                                    {cat.title}
                                                </p>
                                                <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                                    {cat.titleEn}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {cat.services.slice(0, 3).map(s => (
                                                <span key={s} className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                      style={{ background: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)' }}>
                                                    {s}
                                                </span>
                                            ))}
                                            {cat.services.length > 3 && (
                                                <span className="text-[11px] px-2 py-0.5 rounded-full"
                                                      style={{ color: 'var(--text-muted)' }}>
                                                    +{cat.services.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                                              style={{ background: cat.bg, color: cat.accent }}>
                                            <Layers size={10} />
                                            {cat.subcategories.length}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                        <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                            {new Date(cat.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="relative">
                                            <button
                                                onClick={() => setOpenMenu(openMenu === cat.id ? null : cat.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                                style={{ color: 'var(--text-muted)' }}
                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                            {openMenu === cat.id && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />
                                                    <div className="absolute right-0 top-full mt-1 z-40 w-44 rounded-xl py-1.5 shadow-xl"
                                                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                                                        {[
                                                            { label: 'Переглянути', icon: Eye,    action: () => { setViewItem(cat); setOpenMenu(null) } },
                                                            { label: 'Редагувати',  icon: Pencil, action: () => { setEditItem(cat); setOpenMenu(null) } },
                                                            { label: 'Видалити',    icon: Trash2, action: () => { setDeleteItem(cat); setOpenMenu(null) }, danger: true },
                                                        ].map(a => {
                                                            const AIcon = a.icon
                                                            return (
                                                                <button
                                                                    key={a.label}
                                                                    onClick={a.action}
                                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium transition-colors text-left"
                                                                    style={{ color: (a as { danger?: boolean }).danger ? 'var(--admin-danger-text)' : 'var(--text-secondary)' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                                                >
                                                                    <AIcon size={14} /> {a.label}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </>
                                            )}
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
                        Показано {filtered.length} з {categories.length} категорій
                    </p>
                </div>
            </div>

            {/* ═══ ADD / EDIT MODAL ═══ */}
            {(showAdd || editItem) && (
                <CategoryFormModal
                    category={editItem ?? undefined}
                    onSave={editItem ? handleEdit : (data) => handleAdd(data)}
                    onClose={() => { setShowAdd(false); setEditItem(null) }}
                />
            )}

            {/* ═══ VIEW MODAL ═══ */}
            {viewItem && (
                <ViewModal
                    category={viewItem}
                    onClose={() => setViewItem(null)}
                    onEdit={() => { setEditItem(viewItem); setViewItem(null) }}
                    onSubcategoriesChange={(subs) => handleSubcategoryUpdate(viewItem.id, subs)}
                />
            )}

            {/* ═══ DELETE CONFIRM ═══ */}
            {deleteItem && (
                <DeleteModal category={deleteItem} onConfirm={() => handleDelete(deleteItem.id)} onClose={() => setDeleteItem(null)} />
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   FORM MODAL (Add / Edit) — без поля count
   ═══════════════════════════════════════════════════════════════ */
function CategoryFormModal({ category, onSave, onClose }: {
    category?: Category
    onSave: (cat: any) => void
    onClose: () => void
}) {
    const isEdit = !!category
    const [title,    setTitle]    = useState(category?.title ?? '')
    const [titleEn,  setTitleEn]  = useState(category?.titleEn ?? '')
    const [iconName, setIconName] = useState(category?.iconName ?? 'Heart')
    const [photo,    setPhoto]    = useState(category?.photo ?? '')
    const [accent,   setAccent]   = useState(category?.accent ?? '#3b82f6')
    const [bg,       setBg]       = useState(category?.bg ?? '#eff6ff')
    const [services, setServices] = useState(category?.services.join(', ') ?? '')
    const [iconPickerOpen, setIconPickerOpen] = useState(false)

    const SelectedIcon = findIcon(iconName)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const data = {
            ...(category ?? {}),
            title, titleEn, iconName, photo, accent, bg,
            services: services.split(',').map(s => s.trim()).filter(Boolean),
            subcategories: category?.subcategories ?? [],
        }
        onSave(data)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal-panel w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 shrink-0"
                     style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                             style={{ background: accent + '20' }}>
                            <SelectedIcon size={17} color={accent} />
                        </div>
                        <div>
                            <p className="font-semibold text-[15px] m-0" style={{ color: 'var(--text-primary)' }}>
                                {isEdit ? 'Редагувати категорію' : 'Нова категорія'}
                            </p>
                            <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                {isEdit ? `ID: ${category?.id}` : 'Заповніть усі поля'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg"
                            style={{ color: 'var(--text-muted)' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                                <Type size={11} className="inline mr-1" />Назва (UA)
                            </label>
                            <input required value={title} onChange={e => setTitle(e.target.value)}
                                   placeholder="Здоров'я" className={inputCls} style={inputSt} />
                        </div>
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                                <Globe size={11} className="inline mr-1" />Назва (EN)
                            </label>
                            <input required value={titleEn} onChange={e => setTitleEn(e.target.value)}
                                   placeholder="Health" className={inputCls} style={inputSt} />
                        </div>
                    </div>

                    {/* Icon picker */}
                    <div>
                        <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Іконка</label>
                        <div className="relative">
                            <button type="button"
                                    onClick={() => setIconPickerOpen(o => !o)}
                                    className={`${inputCls} flex items-center gap-2.5 text-left`}
                                    style={inputSt}>
                                <SelectedIcon size={16} color={accent} />
                                <span>{iconName}</span>
                                <ChevronDown size={14} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
                            </button>
                            {iconPickerOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIconPickerOpen(false)} />
                                    <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl p-2 shadow-xl max-h-48 overflow-y-auto grid grid-cols-4 gap-1"
                                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                                        {ICON_OPTIONS.map(opt => {
                                            const OptIcon = opt.icon
                                            const selected = opt.name === iconName
                                            return (
                                                <button key={opt.name} type="button"
                                                        onClick={() => { setIconName(opt.name); setIconPickerOpen(false) }}
                                                        className="flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all"
                                                        style={selected
                                                            ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)' }
                                                            : { color: 'var(--text-secondary)' }
                                                        }
                                                        onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)' }}
                                                        onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                                                    <OptIcon size={18} />
                                                    <span className="text-[9px] font-medium">{opt.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                            <ImageIcon size={11} className="inline mr-1" />URL фото
                        </label>
                        <input value={photo} onChange={e => setPhoto(e.target.value)}
                               placeholder="https://images.unsplash.com/..." className={inputCls} style={inputSt} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                                <Palette size={11} className="inline mr-1" />Акцент
                            </label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={accent} onChange={e => setAccent(e.target.value)}
                                       className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent" />
                                <input value={accent} onChange={e => setAccent(e.target.value)}
                                       className={`${inputCls} flex-1`} style={inputSt} />
                            </div>
                        </div>
                        <div>
                            <label className={labelCls} style={{ color: 'var(--text-muted)' }}>
                                <Palette size={11} className="inline mr-1" />Фон іконки
                            </label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                                       className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent" />
                                <input value={bg} onChange={e => setBg(e.target.value)}
                                       className={`${inputCls} flex-1`} style={inputSt} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls} style={{ color: 'var(--text-muted)' }}>Послуги (через кому)</label>
                        <input value={services} onChange={e => setServices(e.target.value)}
                               placeholder="Лікарні, Поліклініки, Аптеки" className={inputCls} style={inputSt} />
                        <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
                            Підкатегорії можна додати після збереження через кнопку «Переглянути»
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 shrink-0"
                     style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                            style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        Скасувати
                    </button>
                    <button onClick={handleSubmit}
                            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <Check size={14} className="inline mr-1.5" />
                        {isEdit ? 'Зберегти' : 'Створити'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   VIEW MODAL — таби: Деталі | Підкатегорії
   ═══════════════════════════════════════════════════════════════ */
function ViewModal({ category, onClose, onEdit, onSubcategoriesChange }: {
    category: Category
    onClose: () => void
    onEdit:  () => void
    onSubcategoriesChange: (subs: Subcategory[]) => void
}) {
    const Icon = findIcon(category.iconName)
    const [activeTab,     setActiveTab]     = useState<'details' | 'subcategories'>('details')
    const [subcategories, setSubcategories] = useState<Subcategory[]>(category.subcategories)
    const [editingSub,    setEditingSub]    = useState<Subcategory | null>(null)
    const [addingNew,     setAddingNew]     = useState(false)
    const [newSubTitle,   setNewSubTitle]   = useState('')
    const [newSubTitleEn, setNewSubTitleEn] = useState('')
    const [deletingSub,   setDeletingSub]   = useState<string | null>(null)

    const syncSubs = (updated: Subcategory[]) => {
        setSubcategories(updated)
        onSubcategoriesChange(updated)
    }

    const handleAddSub = () => {
        if (!newSubTitle.trim()) return
        const sub: Subcategory = {
            id:      newSubTitle.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/g, '-').replace(/-+$/, '') + '-' + Date.now(),
            title:   newSubTitle.trim(),
            titleEn: newSubTitleEn.trim() || newSubTitle.trim(),
        }
        syncSubs([...subcategories, sub])
        setNewSubTitle(''); setNewSubTitleEn(''); setAddingNew(false)
    }

    const handleEditSub = (sub: Subcategory) => {
        syncSubs(subcategories.map(s => s.id === sub.id ? sub : s))
        setEditingSub(null)
    }

    const handleDeleteSub = (id: string) => {
        syncSubs(subcategories.filter(s => s.id !== id))
        setDeletingSub(null)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal-panel w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

                {/* Color bar */}
                <div className="h-1 shrink-0" style={{ background: category.accent }} />

                {/* Photo */}
                {category.photo && (
                    <div className="h-36 overflow-hidden relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={category.photo} alt={category.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65))' }} />
                        <button onClick={onClose}
                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Title row */}
                <div className="px-6 pt-4 pb-3 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                             style={{ background: category.bg }}>
                            <Icon size={20} color={category.accent} strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-[17px] m-0 leading-tight truncate" style={{ color: 'var(--text-primary)' }}>{category.title}</p>
                            <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>{category.titleEn} · ID: {category.id}</p>
                        </div>
                    </div>
                    {!category.photo && (
                        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                                style={{ color: 'var(--text-muted)' }}>
                            <X size={18} />
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="px-6 shrink-0 flex gap-0.5" style={{ borderBottom: '1px solid var(--border)' }}>
                    {[
                        { key: 'details',       label: 'Деталі',                                icon: FolderOpen },
                        { key: 'subcategories', label: `Підкатегорії (${subcategories.length})`, icon: Layers },
                    ].map(tab => {
                        const TabIcon = tab.icon
                        const active = activeTab === tab.key as typeof activeTab
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className="relative flex items-center gap-1.5 px-4 py-2.5 text-[12.5px] font-semibold transition-all"
                                style={{ color: active ? category.accent : 'var(--text-muted)' }}
                            >
                                <TabIcon size={13} />
                                {tab.label}
                                {active && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                                          style={{ background: category.accent }} />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── Details ── */}
                    {activeTab === 'details' && (
                        <div className="px-6 py-4 space-y-3">
                            <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Підкатегорій</span>
                                <span className="font-semibold text-[13px] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1"
                                      style={{ background: category.bg, color: category.accent }}>
                                    <Layers size={10} />{subcategories.length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
                                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>Створено</span>
                                <span className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                                    {new Date(category.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="py-2.5">
                                <span className="text-[12px] block mb-2" style={{ color: 'var(--text-muted)' }}>Послуги</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {category.services.map(s => (
                                        <span key={s} className="text-[11.5px] font-medium px-2.5 py-1 rounded-full"
                                              style={{ background: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)' }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                                    <div className="w-5 h-5 rounded-md shrink-0" style={{ background: category.accent }} />
                                    <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>Акцент: {category.accent}</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                                    <div className="w-5 h-5 rounded-md shrink-0 border" style={{ background: category.bg, borderColor: 'var(--border)' }} />
                                    <span className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>Фон: {category.bg}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Subcategories ── */}
                    {activeTab === 'subcategories' && (
                        <div className="px-6 py-4">
                            {/* Add btn */}
                            {!addingNew && (
                                <button
                                    onClick={() => setAddingNew(true)}
                                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-[13px] font-semibold mb-4 transition-all"
                                    style={{ background: category.accent + '14', color: category.accent, border: `1.5px dashed ${category.accent}55` }}>
                                    <Plus size={14} /> Додати підкатегорію
                                </button>
                            )}

                            {/* New sub form */}
                            {addingNew && (
                                <div className="rounded-xl p-4 mb-4 space-y-3"
                                     style={{ background: 'var(--admin-stat-bg)', border: `1.5px solid ${category.accent}55` }}>
                                    <p className="text-[11px] font-bold uppercase tracking-wider m-0" style={{ color: 'var(--text-muted)' }}>Нова підкатегорія</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            autoFocus
                                            value={newSubTitle} onChange={e => setNewSubTitle(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSub()}
                                            placeholder="Назва (UA)" className={inputCls} style={{ ...inputSt, padding: '8px 12px' }}
                                        />
                                        <input
                                            value={newSubTitleEn} onChange={e => setNewSubTitleEn(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddSub()}
                                            placeholder="Назва (EN)" className={inputCls} style={{ ...inputSt, padding: '8px 12px' }}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button onClick={() => { setAddingNew(false); setNewSubTitle(''); setNewSubTitleEn('') }}
                                                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                                                style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                            Скасувати
                                        </button>
                                        <button onClick={handleAddSub}
                                                className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                                                style={{ background: category.accent }}>
                                            <Check size={12} className="inline mr-1" />Додати
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {subcategories.length === 0 && !addingNew && (
                                <div className="text-center py-10">
                                    <Layers size={32} className="mx-auto mb-3 opacity-30" style={{ color: 'var(--text-muted)' }} />
                                    <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Підкатегорій ще немає</p>
                                </div>
                            )}

                            {/* Sub list */}
                            <div className="space-y-2">
                                {subcategories.map(sub => (
                                    <div key={sub.id}>
                                        {editingSub?.id === sub.id ? (
                                            <SubEditRow
                                                sub={editingSub}
                                                accent={category.accent}
                                                onChange={setEditingSub}
                                                onSave={() => handleEditSub(editingSub)}
                                                onCancel={() => setEditingSub(null)}
                                            />
                                        ) : deletingSub === sub.id ? (
                                            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
                                                 style={{ background: 'var(--admin-danger-bg)', border: '1px solid var(--admin-danger-text)30' }}>
                                                <p className="text-[12.5px] font-medium m-0 truncate" style={{ color: 'var(--admin-danger-text)' }}>
                                                    Видалити «{sub.title}»?
                                                </p>
                                                <div className="flex gap-2 shrink-0">
                                                    <button onClick={() => setDeletingSub(null)}
                                                            className="px-3 py-1 rounded-lg text-[12px] font-semibold"
                                                            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                                                        Ні
                                                    </button>
                                                    <button onClick={() => handleDeleteSub(sub.id)}
                                                            className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white"
                                                            style={{ background: '#ef4444' }}>
                                                        Видалити
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 px-4 py-3 rounded-xl group transition-all cursor-default"
                                                 style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}
                                                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = category.accent + '55'}
                                                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-stat-border)'}>
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                                     style={{ background: category.accent + '18' }}>
                                                    <Layers size={12} color={category.accent} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[13px] font-semibold m-0" style={{ color: 'var(--text-primary)' }}>{sub.title}</p>
                                                    <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>{sub.titleEn}</p>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingSub({ ...sub })}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg"
                                                            style={{ color: 'var(--text-muted)' }}
                                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button onClick={() => setDeletingSub(sub.id)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg"
                                                            style={{ color: 'var(--admin-danger-text)' }}
                                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'}
                                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
                    <button onClick={onEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <Pencil size={14} /> Редагувати
                    </button>
                    <button onClick={onClose}
                            className="px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                            style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Inline sub edit ────────────────────────────────────────── */
function SubEditRow({ sub, accent, onChange, onSave, onCancel }: {
    sub: Subcategory
    accent: string
    onChange: (s: Subcategory) => void
    onSave: () => void
    onCancel: () => void
}) {
    return (
        <div className="rounded-xl p-3 space-y-2"
             style={{ background: 'var(--admin-stat-bg)', border: `1.5px solid ${accent}60` }}>
            <div className="grid grid-cols-2 gap-2">
                <input
                    autoFocus
                    value={sub.title}
                    onChange={e => onChange({ ...sub, title: e.target.value })}
                    placeholder="Назва (UA)" className={inputCls} style={{ ...inputSt, padding: '8px 12px' }}
                />
                <input
                    value={sub.titleEn}
                    onChange={e => onChange({ ...sub, titleEn: e.target.value })}
                    placeholder="Назва (EN)" className={inputCls} style={{ ...inputSt, padding: '8px 12px' }}
                />
            </div>
            <div className="flex gap-2 justify-end">
                <button onClick={onCancel}
                        className="px-3 py-1 rounded-lg text-[12px] font-semibold"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    Скасувати
                </button>
                <button onClick={onSave}
                        className="px-3 py-1 rounded-lg text-[12px] font-semibold text-white"
                        style={{ background: accent }}>
                    <Check size={12} className="inline mr-1" />Зберегти
                </button>
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   DELETE CONFIRM
   ═══════════════════════════════════════════════════════════════ */
function DeleteModal({ category, onConfirm, onClose }: { category: Category; onConfirm: () => void; onClose: () => void }) {
    const Icon = findIcon(category.iconName)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="modal-panel w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                         style={{ background: 'var(--admin-danger-bg)' }}>
                        <Trash2 size={24} style={{ color: 'var(--admin-danger-text)' }} />
                    </div>
                    <p className="font-bold text-[17px] mb-2" style={{ color: 'var(--text-primary)' }}>Видалити категорію?</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: category.bg }}>
                            <Icon size={13} color={category.accent} />
                        </div>
                        <span className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>{category.title}</span>
                    </div>
                    <p className="text-[13px] mb-6 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        Цю дію неможливо скасувати. Усі пов&apos;язані ресурси залишаться без категорії.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                                style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                            Скасувати
                        </button>
                        <button onClick={onConfirm}
                                className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}