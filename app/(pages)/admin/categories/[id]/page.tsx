// app/(pages)/admin/categories/[id]/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital, Globe,
    ArrowLeft, Pencil, Trash2, Plus, Check, X,
    ExternalLink, Layers, Hash, AlignLeft,
    Link as LinkIcon, Type, Search,
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
interface Subcategory {
    id: string; title: string; titleEn: string
}
interface Resource {
    id: string; title: string; description: string
    url: string; subcategoryId: string | null; tags: string[]; createdAt: string
}
interface Category {
    id: string; title: string; titleEn: string
    iconName: string; photo: string; accent: string; bg: string
    services: string[]; subcategories: Subcategory[]; resources: Resource[]
    createdAt: string
}

/* ─── Mock data (same as list page — replace with store/context later) ── */
const MOCK_CATEGORIES: Category[] = [
    {
        id: 'health', title: "Здоров'я", titleEn: 'Health', iconName: 'Heart',
        photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=60',
        accent: '#ef4444', bg: '#fef2f2',
        services: ['Лікарні', 'Поліклініки', 'Аптеки', 'Лабораторії'],
        subcategories: [
            { id: 'hospitals-sub', title: 'Лікарні',  titleEn: 'Hospitals'  },
            { id: 'pharmacies',    title: 'Аптеки',   titleEn: 'Pharmacies' },
        ],
        resources: [
            { id: 'r1', title: 'Черкаська обласна лікарня', description: 'Головний медичний заклад Черкаської області', url: 'https://oblhos.ck.ua', subcategoryId: 'hospitals-sub', tags: ['лікарня', 'стаціонар'], createdAt: '2025-01-10' },
            { id: 'r2', title: 'Міська лікарня №1',         description: 'Многопрофільна міська лікарня',               url: 'https://hospital1.ck.ua', subcategoryId: 'hospitals-sub', tags: ['лікарня'], createdAt: '2025-01-12' },
            { id: 'r3', title: 'Довідник аптек Черкас',     description: 'Список аптек міста з адресами та графіком',   url: 'https://apteka.ck.ua', subcategoryId: 'pharmacies', tags: ['аптека', 'ліки'], createdAt: '2025-01-15' },
            { id: 'r4', title: 'Запис до лікаря онлайн',    description: 'Портал онлайн-запису до лікарів міста',       url: 'https://helsi.me', subcategoryId: null, tags: ['запис', 'онлайн'], createdAt: '2025-02-01' },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'education', title: 'Освіта', titleEn: 'Education', iconName: 'GraduationCap',
        photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=60',
        accent: '#3b82f6', bg: '#eff6ff',
        services: ['Школи', 'Університети', 'Бібліотеки', 'Курси'],
        subcategories: [
            { id: 'schools-sub',  title: 'Школи',        titleEn: 'Schools'      },
            { id: 'universities', title: 'Університети', titleEn: 'Universities' },
        ],
        resources: [
            { id: 'r5', title: 'ЧНУ ім. Хмельницького', description: 'Офіційний сайт університету', url: 'https://cnu.edu.ua', subcategoryId: 'universities', tags: ['університет'], createdAt: '2025-01-05' },
            { id: 'r6', title: 'НВК №1',                 description: 'Навчально-виховний комплекс', url: 'https://nvk1.ck.ua',  subcategoryId: 'schools-sub',  tags: ['школа'],       createdAt: '2025-01-20' },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'council', title: 'Міська Рада', titleEn: 'City Council', iconName: 'Building2',
        photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=800&q=60',
        accent: '#f59e0b', bg: '#fffbeb',
        services: ['Документи', 'Дозволи', 'Реєстрація', 'Петиції'],
        subcategories: [{ id: 'docs', title: 'Документи', titleEn: 'Documents' }],
        resources: [
            { id: 'r7', title: 'Сайт міської ради', description: 'Новини, рішення ради', url: 'https://mrada.ck.ua', subcategoryId: null, tags: ['рада'], createdAt: '2024-11-01' },
        ],
        createdAt: '2024-10-20',
    },
    {
        id: 'social', title: 'Соціальні Послуги', titleEn: 'Social Services', iconName: 'Users',
        photo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=60',
        accent: '#8b5cf6', bg: '#f5f3ff',
        services: ['Допомога', 'Пільги', 'Субсидії', 'Підтримка'],
        subcategories: [], resources: [], createdAt: '2024-11-01',
    },
    {
        id: 'utilities', title: 'Комунальні Послуги', titleEn: 'Utilities', iconName: 'Zap',
        photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=60',
        accent: '#10b981', bg: '#ecfdf5',
        services: ['Вода', 'Електрика', 'Газ', 'Опалення'],
        subcategories: [
            { id: 'water',       title: 'Водопостачання',    titleEn: 'Water'        },
            { id: 'electricity', title: 'Електропостачання', titleEn: 'Electricity'  },
        ],
        resources: [
            { id: 'r8', title: 'Черкасиводоканал', description: 'Водопостачання та водовідведення', url: 'https://vodokanal.ck.ua', subcategoryId: 'water', tags: ['вода'], createdAt: '2024-12-10' },
        ],
        createdAt: '2024-11-05',
    },
    {
        id: 'transport', title: 'Транспорт', titleEn: 'Transport', iconName: 'Bus',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=60',
        accent: '#f97316', bg: '#fff7ed',
        services: ['Розклад', 'Парковка', 'Дороги', 'Права'],
        subcategories: [{ id: 'buses', title: 'Автобуси', titleEn: 'Buses' }],
        resources: [
            { id: 'r9', title: 'Розклад маршрутів', description: 'Актуальний розклад транспорту', url: 'https://marshrutky.ck.ua', subcategoryId: 'buses', tags: ['маршрут'], createdAt: '2025-01-08' },
        ],
        createdAt: '2024-11-15',
    },
    {
        id: 'emergency', title: 'Екстрені Служби', titleEn: 'Emergency', iconName: 'AlertCircle',
        photo: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&q=60',
        accent: '#dc2626', bg: '#fef2f2',
        services: ['Пожежна', 'Поліція', 'Швидка', 'ДСНС'],
        subcategories: [], resources: [], createdAt: '2024-11-20',
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
export default function CategoryDetailPage() {
    const { id } = useParams<{ id: string }>()
    const router  = useRouter()

    const initial = MOCK_CATEGORIES.find(c => c.id === id)

    const [cat,  setCat]  = useState<Category | null>(initial ?? null)
    const [resSearch, setResSearch] = useState('')

    if (!cat) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <p className="text-5xl">🔍</p>
            <p className="text-[16px] font-semibold" style={{ color: 'var(--text-primary)' }}>Категорію не знайдено</p>
            <button onClick={() => router.push('/admin/categories')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold"
                    style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={14} /> Повернутись до списку
            </button>
        </div>
    )

    const Icon = findIcon(cat.iconName)

    /* ── subcategory handlers ── */
    const updateSubs = (subs: Subcategory[]) => setCat(c => c ? { ...c, subcategories: subs } : c)
    const updateRes  = (res: Resource[])     => setCat(c => c ? { ...c, resources: res }     : c)

    /* ── filtered resources ── */
    const filteredRes = useMemo(() => {
        const q = resSearch.toLowerCase()
        if (!q) return cat.resources
        return cat.resources.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.tags.some(t => t.toLowerCase().includes(q))
        )
    }, [cat.resources, resSearch])

    /* ── group resources by subcategory ── */
    const resGroups = useMemo(() => {
        const groups: { sub: Subcategory | null; items: Resource[] }[] = []
        const direct = filteredRes.filter(r => r.subcategoryId === null)
        if (direct.length) groups.push({ sub: null, items: direct })
        cat.subcategories.forEach(sub => {
            const items = filteredRes.filter(r => r.subcategoryId === sub.id)
            if (items.length) groups.push({ sub, items })
        })
        return groups
    }, [filteredRes, cat.subcategories])

    return (
        <div className="max-w-[1100px] mx-auto">

            {/* ── Breadcrumb + back ── */}
            <div className="flex items-center gap-2 mb-6 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                <button onClick={() => router.push('/admin/categories')}
                        className="flex items-center gap-1.5 hover:underline transition-all"
                        style={{ color: 'var(--text-muted)' }}>
                    <ArrowLeft size={13} /> Категорії
                </button>
                <span className="text-[10px]">›</span>
                <span style={{ color: 'var(--text-primary)' }}>{cat.title}</span>
            </div>

            {/* ── Hero card ── */}
            <div className="rounded-2xl overflow-hidden mb-8 relative"
                 style={{ border: '1px solid var(--admin-table-border)' }}>
                {cat.photo && (
                    <div className="h-36 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={cat.photo} alt={cat.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,.7))' }} />
                    </div>
                )}
                <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                     style={{ background: 'var(--admin-table-bg)', borderTop: cat.photo ? '0' : undefined }}>
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                             style={{ background: cat.bg, boxShadow: `0 0 0 4px ${cat.accent}22` }}>
                            <Icon size={26} color={cat.accent} strokeWidth={1.7} />
                        </div>
                        <div>
                            <h1 className="text-[clamp(20px,2.5vw,28px)] font-bold m-0 leading-tight"
                                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                                {cat.title}
                            </h1>
                            <p className="text-[13px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                {cat.titleEn} · ID: {cat.id}
                            </p>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center px-4 py-2 rounded-xl" style={{ background: cat.bg }}>
                            <p className="text-[18px] font-bold m-0" style={{ color: cat.accent }}>{cat.subcategories.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide m-0 mt-0.5" style={{ color: cat.accent + 'cc' }}>підкатег.</p>
                        </div>
                        <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'var(--admin-badge-bg)' }}>
                            <p className="text-[18px] font-bold m-0" style={{ color: 'var(--admin-badge-text)' }}>{cat.resources.length}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wide m-0 mt-0.5" style={{ color: 'var(--admin-badge-text)' }}>ресурсів</p>
                        </div>
                        <button
                            onClick={() => {/* TODO: open edit modal */}}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                            style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-secondary)' }}>
                            <Pencil size={14} /> Редагувати
                        </button>
                    </div>
                </div>

                {/* Services row */}
                <div className="px-6 py-3 flex flex-wrap gap-1.5"
                     style={{ borderTop: '1px solid var(--border)', background: 'var(--admin-table-bg)' }}>
                    <span className="text-[11px] font-bold uppercase tracking-widest mr-2" style={{ color: 'var(--text-muted)' }}>Послуги:</span>
                    {cat.services.map(s => (
                        <span key={s} className="text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                              style={{ background: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)' }}>{s}</span>
                    ))}
                </div>
            </div>

            {/* ── Two-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

                {/* ══ LEFT: Subcategories ══ */}
                <SubcategoriesPanel
                    cat={cat}
                    onUpdate={updateSubs}
                />

                {/* ══ RIGHT: Resources ══ */}
                <ResourcesPanel
                    cat={cat}
                    resSearch={resSearch}
                    setResSearch={setResSearch}
                    resGroups={resGroups}
                    onUpdate={updateRes}
                />
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   SUBCATEGORIES PANEL
   ═══════════════════════════════════════════════════════════════ */
function SubcategoriesPanel({ cat, onUpdate }: {
    cat: Category
    onUpdate: (subs: Subcategory[]) => void
}) {
    const [adding,    setAdding]    = useState(false)
    const [editId,    setEditId]    = useState<string | null>(null)
    const [deleteId,  setDeleteId]  = useState<string | null>(null)
    const [newTitle,  setNewTitle]  = useState('')
    const [newTitleEn,setNewTitleEn]= useState('')

    const [editTitle,   setEditTitle]   = useState('')
    const [editTitleEn, setEditTitleEn] = useState('')

    const startEdit = (sub: Subcategory) => {
        setEditId(sub.id); setEditTitle(sub.title); setEditTitleEn(sub.titleEn)
    }

    const handleAdd = () => {
        if (!newTitle.trim()) return
        const sub: Subcategory = {
            id:      newTitle.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/g, '-') + '-' + Date.now(),
            title:   newTitle.trim(),
            titleEn: newTitleEn.trim() || newTitle.trim(),
        }
        onUpdate([...cat.subcategories, sub])
        setNewTitle(''); setNewTitleEn(''); setAdding(false)
    }

    const handleEdit = () => {
        if (!editTitle.trim() || !editId) return
        onUpdate(cat.subcategories.map(s => s.id === editId
            ? { ...s, title: editTitle.trim(), titleEn: editTitleEn.trim() || editTitle.trim() }
            : s
        ))
        setEditId(null)
    }

    const handleDelete = (id: string) => {
        onUpdate(cat.subcategories.filter(s => s.id !== id))
        setDeleteId(null)
    }

    const resCountFor = (subId: string) => cat.resources.filter(r => r.subcategoryId === subId).length

    return (
        <div className="rounded-2xl overflow-hidden h-fit"
             style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
                 style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: cat.accent + '18' }}>
                        <Layers size={14} color={cat.accent} />
                    </div>
                    <div>
                        <p className="font-semibold text-[13.5px] m-0" style={{ color: 'var(--text-primary)' }}>Підкатегорії</p>
                        <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>{cat.subcategories.length} шт.</p>
                    </div>
                </div>
                {!adding && (
                    <button onClick={() => setAdding(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:opacity-80"
                            style={{ background: cat.accent + '15', color: cat.accent }}>
                        <Plus size={13} /> Додати
                    </button>
                )}
            </div>

            {/* Add form */}
            {adding && (
                <div className="px-5 py-4 space-y-2.5" style={{ borderBottom: '1px solid var(--border)', background: cat.accent + '06' }}>
                    <p className="text-[10.5px] font-bold uppercase tracking-widest m-0" style={{ color: 'var(--text-muted)' }}>Нова підкатегорія</p>
                    <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleAdd()}
                           placeholder="Назва (UA)" className={inputCls} style={inputSt} />
                    <input value={newTitleEn} onChange={e => setNewTitleEn(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleAdd()}
                           placeholder="Назва (EN)" className={inputCls} style={inputSt} />
                    <div className="flex gap-2">
                        <button onClick={() => { setAdding(false); setNewTitle(''); setNewTitleEn('') }}
                                className="flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                            Скасувати
                        </button>
                        <button onClick={handleAdd} disabled={!newTitle.trim()}
                                className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white disabled:opacity-40 transition-all"
                                style={{ background: cat.accent }}>
                            <Check size={12} className="inline mr-1" /> Додати
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {cat.subcategories.length === 0 && !adding && (
                    <div className="px-5 py-10 text-center">
                        <Layers size={28} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--text-muted)' }} />
                        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Підкатегорій ще немає</p>
                    </div>
                )}

                {cat.subcategories.map(sub => (
                    <div key={sub.id}>
                        {/* Delete confirm */}
                        {deleteId === sub.id ? (
                            <div className="px-5 py-3.5 flex items-center justify-between gap-3"
                                 style={{ background: 'var(--admin-danger-bg)' }}>
                                <p className="text-[12.5px] font-medium m-0 truncate" style={{ color: 'var(--admin-danger-text)' }}>
                                    Видалити «{sub.title}»?
                                </p>
                                <div className="flex gap-2 shrink-0">
                                    <button onClick={() => setDeleteId(null)}
                                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                                            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                        Ні
                                    </button>
                                    <button onClick={() => handleDelete(sub.id)}
                                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                                            style={{ background: '#ef4444' }}>
                                        Так
                                    </button>
                                </div>
                            </div>
                        ) : editId === sub.id ? (
                            /* Edit inline */
                            <div className="px-5 py-3.5 space-y-2.5" style={{ background: cat.accent + '06' }}>
                                <input autoFocus value={editTitle} onChange={e => setEditTitle(e.target.value)}
                                       onKeyDown={e => e.key === 'Enter' && handleEdit()}
                                       className={inputCls} style={inputSt} />
                                <input value={editTitleEn} onChange={e => setEditTitleEn(e.target.value)}
                                       onKeyDown={e => e.key === 'Enter' && handleEdit()}
                                       placeholder="Назва (EN)" className={inputCls} style={inputSt} />
                                <div className="flex gap-2">
                                    <button onClick={() => setEditId(null)}
                                            className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold"
                                            style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                                        Скасувати
                                    </button>
                                    <button onClick={handleEdit}
                                            className="flex-1 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                                            style={{ background: cat.accent }}>
                                        <Check size={12} className="inline mr-1" /> Зберегти
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Normal row */
                            <div className="px-5 py-3.5 flex items-center gap-3 group transition-colors"
                                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                                     style={{ background: cat.accent + '15' }}>
                                    <Layers size={13} color={cat.accent} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold m-0 truncate" style={{ color: 'var(--text-primary)' }}>{sub.title}</p>
                                    <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                        {sub.titleEn} · {resCountFor(sub.id)} ресурсів
                                    </p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                    <button onClick={() => startEdit(sub)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={() => setDeleteId(sub.id)}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                                            style={{ color: 'var(--admin-danger-text)' }}
                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'}
                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   RESOURCES PANEL
   ═══════════════════════════════════════════════════════════════ */
function ResourcesPanel({ cat, resSearch, setResSearch, resGroups, onUpdate }: {
    cat: Category
    resSearch: string
    setResSearch: (v: string) => void
    resGroups: { sub: Subcategory | null; items: Resource[] }[]
    onUpdate: (res: Resource[]) => void
}) {
    const [showForm,  setShowForm]  = useState(false)
    const [editRes,   setEditRes]   = useState<Resource | null>(null)
    const [deleteId,  setDeleteId]  = useState<string | null>(null)

    const handleSave = (r: Resource) => {
        if (editRes) {
            onUpdate(cat.resources.map(x => x.id === r.id ? r : x))
            setEditRes(null)
        } else {
            onUpdate([...cat.resources, { ...r, id: 'r-' + Date.now(), createdAt: new Date().toISOString().split('T')[0] }])
            setShowForm(false)
        }
    }

    const handleDelete = (id: string) => {
        onUpdate(cat.resources.filter(r => r.id !== id))
        setDeleteId(null)
    }

    return (
        <div className="rounded-2xl overflow-hidden"
             style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
                 style={{ borderBottom: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                         style={{ background: 'var(--admin-badge-bg)' }}>
                        <Globe size={14} style={{ color: 'var(--admin-badge-text)' }} />
                    </div>
                    <div>
                        <p className="font-semibold text-[13.5px] m-0" style={{ color: 'var(--text-primary)' }}>Ресурси</p>
                        <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>{cat.resources.length} шт.</p>
                    </div>
                </div>
                {!showForm && !editRes && (
                    <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all hover:opacity-80 text-white"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                        <Plus size={13} /> Додати ресурс
                    </button>
                )}
            </div>

            {/* Resource form */}
            {(showForm || editRes) && (
                <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--admin-stat-bg)' }}>
                    <ResourceForm
                        resource={editRes ?? undefined}
                        subcategories={cat.subcategories}
                        accent={cat.accent}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditRes(null) }}
                    />
                </div>
            )}

            {/* Search */}
            {cat.resources.length > 3 && (
                <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                         style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <input type="text" placeholder="Пошук ресурсів..."
                               value={resSearch} onChange={e => setResSearch(e.target.value)}
                               className="flex-1 bg-transparent text-[13px] outline-none"
                               style={{ color: 'var(--text-primary)' }} />
                        {resSearch && <button onClick={() => setResSearch('')} style={{ color: 'var(--text-muted)' }}><X size={13} /></button>}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {cat.resources.length === 0 && !showForm && (
                <div className="px-5 py-14 text-center">
                    <Globe size={32} className="mx-auto mb-3 opacity-20" style={{ color: 'var(--text-muted)' }} />
                    <p className="text-[14px] font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Ресурсів ще немає</p>
                    <p className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                        Натисніть «Додати ресурс» щоб створити перший
                    </p>
                </div>
            )}

            {/* No results from search */}
            {cat.resources.length > 0 && resGroups.length === 0 && (
                <div className="px-5 py-10 text-center">
                    <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>Нічого не знайдено</p>
                </div>
            )}

            {/* Resource groups */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {resGroups.map((group, gi) => (
                    <div key={group.sub?.id ?? '__direct__'}>
                        {/* Group header */}
                        <div className="flex items-center gap-2 px-5 py-2.5"
                             style={{ background: gi % 2 === 0 ? 'transparent' : cat.accent + '04',
                                 borderBottom: '1px solid var(--border)' }}>
                            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                                 style={{ background: group.sub ? cat.accent + '18' : 'var(--admin-badge-bg)' }}>
                                {group.sub
                                    ? <Layers size={10} color={cat.accent} />
                                    : <Globe size={10} style={{ color: 'var(--admin-badge-text)' }} />
                                }
                            </div>
                            <p className="text-[11.5px] font-bold m-0" style={{ color: group.sub ? cat.accent : 'var(--text-secondary)' }}>
                                {group.sub ? group.sub.title : 'Напряму в категорії'}
                            </p>
                            <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-full ml-auto"
                                  style={{ background: group.sub ? cat.accent + '15' : 'var(--admin-badge-bg)',
                                      color: group.sub ? cat.accent : 'var(--admin-badge-text)' }}>
                                {group.items.length}
                            </span>
                        </div>

                        {/* Resources in group */}
                        {group.items.map(res => (
                            <div key={res.id}>
                                {deleteId === res.id ? (
                                    <div className="px-5 py-3.5 flex items-center justify-between gap-3"
                                         style={{ background: 'var(--admin-danger-bg)' }}>
                                        <p className="text-[12.5px] font-medium m-0 truncate" style={{ color: 'var(--admin-danger-text)' }}>
                                            Видалити «{res.title}»?
                                        </p>
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => setDeleteId(null)}
                                                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                                                Ні
                                            </button>
                                            <button onClick={() => handleDelete(res.id)}
                                                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
                                                    style={{ background: '#ef4444' }}>
                                                Так
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-5 py-3.5 flex items-start gap-3 group transition-colors"
                                         onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                         onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                        {/* Link icon */}
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                             style={{ background: cat.accent + '12' }}>
                                            <LinkIcon size={13} color={cat.accent} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <p className="text-[13.5px] font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
                                                    {res.title}
                                                </p>
                                                <a href={res.url} target="_blank" rel="noopener noreferrer"
                                                   className="opacity-0 group-hover:opacity-60 transition-opacity"
                                                   style={{ color: cat.accent }}>
                                                    <ExternalLink size={11} />
                                                </a>
                                            </div>
                                            {res.description && (
                                                <p className="text-[12px] m-0 mt-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                                                    {res.description}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                                    {new Date(res.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                                {res.tags.map(tag => (
                                                    <span key={tag} className="text-[10.5px] font-medium px-1.5 py-0.5 rounded-md"
                                                          style={{ background: cat.accent + '12', color: cat.accent }}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                            <button onClick={() => { setEditRes({ ...res }); setShowForm(false) }}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg"
                                                    style={{ color: 'var(--text-muted)' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <Pencil size={13} />
                                            </button>
                                            <button onClick={() => setDeleteId(res.id)}
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
                ))}
            </div>
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   RESOURCE FORM
   ═══════════════════════════════════════════════════════════════ */
function ResourceForm({ resource, subcategories, accent, onSave, onCancel }: {
    resource?:     Resource
    subcategories: Subcategory[]
    accent:        string
    onSave:        (r: Resource) => void
    onCancel:      () => void
}) {
    const [title,         setTitle]         = useState(resource?.title         ?? '')
    const [description,   setDescription]   = useState(resource?.description   ?? '')
    const [url,           setUrl]           = useState(resource?.url           ?? '')
    const [subcategoryId, setSubcategoryId] = useState<string | null>(resource?.subcategoryId ?? null)
    const [tags,          setTags]          = useState(resource?.tags.join(', ') ?? '')

    const save = () => {
        if (!title.trim() || !url.trim()) return
        onSave({
            id:          resource?.id ?? '',
            title:       title.trim(),
            description: description.trim(),
            url:         url.trim(),
            subcategoryId,
            tags:        tags.split(',').map(t => t.trim()).filter(Boolean),
            createdAt:   resource?.createdAt ?? '',
        })
    }

    const isEdit = !!resource

    return (
        <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest m-0" style={{ color: 'var(--text-muted)' }}>
                {isEdit ? 'Редагувати ресурс' : 'Новий ресурс'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                       placeholder="Короткий опис" className={inputCls} style={inputSt} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                        <Layers size={9} className="inline mr-1" />Підкатегорія
                    </label>
                    <select value={subcategoryId ?? ''} onChange={e => setSubcategoryId(e.target.value || null)}
                            className={inputCls} style={{ ...inputSt, paddingTop: '10px', paddingBottom: '10px' }}>
                        <option value="">— Напряму в категорії —</option>
                        {subcategories.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
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

            <div className="flex gap-2 justify-end pt-1">
                <button onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
                        style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    Скасувати
                </button>
                <button onClick={save} disabled={!title.trim() || !url.trim()}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white disabled:opacity-40 transition-all"
                        style={{ background: accent }}>
                    <Check size={12} className="inline mr-1" />{isEdit ? 'Зберегти' : 'Додати ресурс'}
                </button>
            </div>
        </div>
    )
}