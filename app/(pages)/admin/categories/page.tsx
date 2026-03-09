// app/(pages)/admin/categories/page.tsx
'use client'

import React, {useState, useMemo} from 'react'
import {useRouter} from 'next/navigation'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital, Globe,
    Search, X, Plus, Pencil, Trash2,
    ArrowUpDown, MoreHorizontal,
    Image as ImageIcon, Palette, Type,
    ChevronDown, Check, Layers, ChevronRight
} from 'lucide-react'
import {Category, MOCK_CATEGORIES} from "@/app/constants/mock-categories";

/* ─── Icon registry ──────────────────────────────────────────── */
const ICON_OPTIONS: { name: string; icon: React.ElementType }[] = [
    {name: 'Heart', icon: Heart},
    {name: 'GraduationCap', icon: GraduationCap},
    {name: 'Building2', icon: Building2},
    {name: 'Users', icon: Users},
    {name: 'Zap', icon: Zap},
    {name: 'Briefcase', icon: Briefcase},
    {name: 'Bus', icon: Bus},
    {name: 'AlertCircle', icon: AlertCircle},
    {name: 'Calendar', icon: Calendar},
    {name: 'School', icon: School},
    {name: 'Baby', icon: Baby},
    {name: 'Hospital', icon: Hospital},
    {name: 'Globe', icon: Globe},
]
const findIcon = (name: string) => ICON_OPTIONS.find(i => i.name === name)?.icon ?? Heart


/* ─── Form styles ────────────────────────────────────────────── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-150 focus:ring-2 focus:ring-blue-500/40'
const inputSt: React.CSSProperties = {
    background: 'var(--admin-stat-bg)',
    border: '1px solid var(--admin-stat-border)',
    color: 'var(--text-primary)'
}
const labelCls = 'block text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5'

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function AdminCategoriesPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'title' | 'subs' | 'res' | 'createdAt'>('title')
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
    const [showAdd, setShowAdd] = useState(false)
    const [editItem, setEditItem] = useState<Category | null>(null)
    const [deleteItem, setDeleteItem] = useState<Category | null>(null)
    const [openMenu, setOpenMenu] = useState<string | null>(null)

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        const list = categories.filter(c =>
            !q || c.title.toLowerCase().includes(q) || c.titleEn.toLowerCase().includes(q) ||
            c.services.some(s => s.toLowerCase().includes(q))
        )
        list.sort((a, b) => {
            let cmp = 0
            if (sortBy === 'title') cmp = a.title.localeCompare(b.title, 'uk')
            if (sortBy === 'subs') cmp = a.subcategories.length - b.subcategories.length
            if (sortBy === 'res') cmp = a.resources.length - b.resources.length
            if (sortBy === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            return sortDir === 'asc' ? cmp : -cmp
        })
        return list
    }, [categories, search, sortBy, sortDir])

    const toggleSort = (col: typeof sortBy) => {
        if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else {
            setSortBy(col);
            setSortDir('asc')
        }
    }

    const handleAdd = (cat: Omit<Category, 'id' | 'createdAt'>) => {
        const id = cat.title.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/g, '-').replace(/-+$/, '')
        setCategories(prev => [...prev, {...cat, id, createdAt: new Date().toISOString().split('T')[0]}])
        setShowAdd(false)
    }
    const handleEdit = (cat: Category) => {
        setCategories(prev => prev.map(c => c.id === cat.id ? cat : c))
        setEditItem(null)
    }
    const handleDelete = (id: string) => {
        setCategories(prev => prev.filter(c => c.id !== id))
        setDeleteItem(null)
    }

    const totalSubs = categories.reduce((s, c) => s + c.subcategories.length, 0)
    const totalRes = categories.reduce((s, c) => s + c.resources.length, 0)

    return (
        <div className="max-w-350 mx-auto">

            {/* ── Header ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{color: 'var(--text-muted)'}}>
                    <span>Адмін-панель</span><span className="text-[10px]">›</span>
                    <span style={{color: 'var(--text-primary)'}}>Категорії</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{fontFamily: 'var(--font-display)', color: 'var(--text-primary)'}}>
                            Управління категоріями
                        </h1>
                        <p className="text-[14px] mt-1" style={{color: 'var(--text-secondary)'}}>
                            {categories.length} категорій · {totalSubs} підкатегорій · {totalRes} ресурсів
                        </p>
                    </div>
                    <button onClick={() => setShowAdd(true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.97]"
                            style={{
                                background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
                                boxShadow: '0 2px 12px rgba(59,130,246,.3)'
                            }}>
                        <Plus size={16}/> Додати категорію
                    </button>
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                    {label: 'Категорій', value: categories.length, accent: '#3b82f6'},
                    {label: 'Підкатегорій', value: totalSubs, accent: '#10b981'},
                    {label: 'Ресурсів', value: totalRes, accent: '#8b5cf6'},
                    {label: 'Остання зміна', value: 'Сьогодні', accent: '#f59e0b'},
                ].map(s => (
                    <div key={s.label} className="rounded-xl px-4 py-3"
                         style={{background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)'}}>
                        <p className="text-[20px] font-bold m-0"
                           style={{fontFamily: 'var(--font-display)', color: 'var(--text-primary)'}}>{s.value}</p>
                        <p className="text-[11.5px] m-0 mt-0.5" style={{color: 'var(--text-muted)'}}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* ── Search + sort ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 flex-1"
                     style={{background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)'}}>
                    <Search size={15} style={{color: 'var(--text-muted)', flexShrink: 0}}/>
                    <input type="text" placeholder="Пошук категорій..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           className="flex-1 bg-transparent text-[13.5px] outline-none"
                           style={{color: 'var(--text-primary)'}}/>
                    {search && <button onClick={() => setSearch('')} style={{color: 'var(--text-muted)'}}><X size={14}/>
                    </button>}
                </div>
                <div className="flex gap-2 flex-wrap">
                    {([
                        {col: 'title' as const, label: 'Назва'},
                        {col: 'subs' as const, label: 'Підкатегорії'},
                        {col: 'res' as const, label: 'Ресурси'},
                        {col: 'createdAt' as const, label: 'Дата'},
                    ]).map(s => (
                        <button key={s.col} onClick={() => toggleSort(s.col)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={sortBy === s.col
                                    ? {
                                        background: 'var(--admin-nav-active-bg)',
                                        color: 'var(--admin-nav-active-text)',
                                        border: '1px solid var(--admin-badge-border)'
                                    }
                                    : {
                                        background: 'var(--admin-stat-bg)',
                                        color: 'var(--text-muted)',
                                        border: '1px solid var(--admin-stat-border)'
                                    }}>
                            <ArrowUpDown size={12}/>{s.label}
                            {sortBy === s.col && <span className="text-[10px]">{sortDir === 'asc' ? '↑' : '↓'}</span>}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-2xl overflow-hidden"
                 style={{background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)'}}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-160">
                        <thead>
                        <tr style={{borderBottom: '1px solid var(--border)'}}>
                            {['Категорія', 'Послуги', 'Підкат.', 'Ресурси', 'Створено', ''].map(h => (
                                <th key={h}
                                    className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3.5"
                                    style={{color: 'var(--text-muted)'}}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-16">
                                    <p className="text-3xl mb-2">🔍</p>
                                    <p className="font-semibold text-[14px] mb-1"
                                       style={{color: 'var(--text-primary)'}}>Нічого не знайдено</p>
                                    <button onClick={() => setSearch('')} className="text-[13px] font-medium"
                                            style={{color: 'var(--text-accent)'}}>Скинути пошук
                                    </button>
                                </td>
                            </tr>
                        )}
                        {filtered.map(cat => {
                            const Icon = findIcon(cat.iconName)
                            return (
                                <tr key={cat.id}
                                    className="cursor-pointer transition-colors group"
                                    style={{borderBottom: '1px solid var(--border)'}}
                                    onClick={() => router.push(`/admin/categories/${cat.id}`)}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                                    {/* Category name */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center"
                                                style={{background: cat.bg}}>
                                                <Icon size={16} color={cat.accent} strokeWidth={1.8}/>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-[13.5px] m-0 leading-tight"
                                                   style={{color: 'var(--text-primary)'}}>{cat.title}</p>
                                                <p className="text-[11px] m-0"
                                                   style={{color: 'var(--text-muted)'}}>{cat.titleEn}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Services */}
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                        <div className="flex flex-wrap gap-1">
                                            {cat.services.slice(0, 2).map(s => (
                                                <span key={s}
                                                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                                                      style={{
                                                          background: 'var(--admin-badge-bg)',
                                                          color: 'var(--admin-badge-text)'
                                                      }}>{s}</span>
                                            ))}
                                            {cat.services.length > 2 && (
                                                <span className="text-[11px] px-2 py-0.5 rounded-full"
                                                      style={{color: 'var(--text-muted)'}}>+{cat.services.length - 2}</span>
                                            )}
                                        </div>
                                    </td>

                                    {/* Subcategories count */}
                                    <td className="px-5 py-3.5">
                                            <span
                                                className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                                                style={{background: cat.bg, color: cat.accent}}>
                                                <Layers size={10}/>{cat.subcategories.length}
                                            </span>
                                    </td>

                                    {/* Resources count */}
                                    <td className="px-5 py-3.5">
                                            <span
                                                className="inline-flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                                                style={{
                                                    background: 'var(--admin-badge-bg)',
                                                    color: 'var(--admin-badge-text)'
                                                }}>
                                                <Globe size={10}/>{cat.resources.length}
                                            </span>
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                            <span className="text-[12px]" style={{color: 'var(--text-muted)'}}>
                                                {new Date(cat.createdAt).toLocaleDateString('uk-UA', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1">
                                            {/* Arrow hint on hover */}
                                            <ChevronRight size={15}
                                                          className="opacity-0 group-hover:opacity-40 transition-opacity mr-1"
                                                          style={{color: 'var(--text-muted)'}}/>
                                            <div className="relative">
                                                <button onClick={() => setOpenMenu(openMenu === cat.id ? null : cat.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                                        style={{color: 'var(--text-muted)'}}
                                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                    <MoreHorizontal size={16}/>
                                                </button>
                                                {openMenu === cat.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-30"
                                                             onClick={() => setOpenMenu(null)}/>
                                                        <div
                                                            className="absolute right-0 top-full mt-1 z-40 w-44 rounded-xl py-1.5 shadow-xl"
                                                            style={{
                                                                background: 'var(--bg-card)',
                                                                border: '1px solid var(--border-card)'
                                                            }}>
                                                            {[
                                                                {
                                                                    label: 'Редагувати', icon: Pencil, action: () => {
                                                                        setEditItem(cat);
                                                                        setOpenMenu(null)
                                                                    }
                                                                },
                                                                {
                                                                    label: 'Видалити', icon: Trash2, action: () => {
                                                                        setDeleteItem(cat);
                                                                        setOpenMenu(null)
                                                                    }, danger: true
                                                                },
                                                            ].map(a => {
                                                                const AIcon = a.icon
                                                                return (
                                                                    <button key={a.label} onClick={a.action}
                                                                            className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium transition-colors text-left"
                                                                            style={{
                                                                                color: (a as {
                                                                                    danger?: boolean
                                                                                }).danger ? 'var(--admin-danger-text)' : 'var(--text-secondary)'
                                                                            }}
                                                                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                                        <AIcon size={14}/>{a.label}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-between px-5 py-3"
                     style={{borderTop: '1px solid var(--border)'}}>
                    <p className="text-[12px] m-0" style={{color: 'var(--text-muted)'}}>
                        Показано {filtered.length} з {categories.length} · Клікніть на рядок щоб керувати вмістом
                    </p>
                </div>
            </div>

            {/* ─── Modals ─── */}
            {(showAdd || editItem) && (
                <CategoryFormModal
                    category={editItem ?? undefined}
                    onSave={editItem ? handleEdit : (d) => handleAdd(d)}
                    onClose={() => {
                        setShowAdd(false);
                        setEditItem(null)
                    }}
                />
            )}
            {deleteItem && (
                <DeleteModal category={deleteItem} onConfirm={() => handleDelete(deleteItem.id)}
                             onClose={() => setDeleteItem(null)}/>
            )}
        </div>
    )
}

/* ═══════════════════════════════════════════════════════════════
   CATEGORY FORM MODAL
   ═══════════════════════════════════════════════════════════════ */
function CategoryFormModal({category, onSave, onClose}: {
    category?: Category; onSave: (cat: any) => void; onClose: () => void
}) {
    const isEdit = !!category
    const [title, setTitle] = useState(category?.title ?? '')
    const [titleEn, setTitleEn] = useState(category?.titleEn ?? '')
    const [iconName, setIconName] = useState(category?.iconName ?? 'Heart')
    const [photo, setPhoto] = useState(category?.photo ?? '')
    const [accent, setAccent] = useState(category?.accent ?? '#3b82f6')
    const [bg, setBg] = useState(category?.bg ?? '#eff6ff')
    const [services, setServices] = useState(category?.services.join(', ') ?? '')
    const [iconOpen, setIconOpen] = useState(false)
    const SelectedIcon = findIcon(iconName)

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault()
        onSave({
            ...(category ?? {}), title, titleEn, iconName, photo, accent, bg,
            services: services.split(',').map(s => s.trim()).filter(Boolean),
            subcategories: category?.subcategories ?? [],
            resources: category?.resources ?? [],
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)'}}
             onClick={e => {
                 if (e.target === e.currentTarget) onClose()
             }}>
            <div className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
                 style={{background: 'var(--bg-card)', border: '1px solid var(--border-card)'}}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 shrink-0"
                     style={{borderBottom: '1px solid var(--border)'}}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                             style={{background: accent + '20'}}>
                            <SelectedIcon size={17} color={accent}/>
                        </div>
                        <div>
                            <p className="font-semibold text-[15px] m-0" style={{color: 'var(--text-primary)'}}>
                                {isEdit ? 'Редагувати категорію' : 'Нова категорія'}
                            </p>
                            <p className="text-[11px] m-0" style={{color: 'var(--text-muted)'}}>
                                {isEdit ? `ID: ${category?.id}` : 'Заповніть поля та збережіть'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg"
                            style={{color: 'var(--text-muted)'}}>
                        <X size={18}/>
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls} style={{color: 'var(--text-muted)'}}><Type size={10}
                                                                                                   className="inline mr-1"/>Назва
                                (UA)</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)}
                                   placeholder="Здоров'я" className={inputCls} style={inputSt}/>
                        </div>
                        <div>
                            <label className={labelCls} style={{color: 'var(--text-muted)'}}><Globe size={10}
                                                                                                    className="inline mr-1"/>Назва
                                (EN)</label>
                            <input required value={titleEn} onChange={e => setTitleEn(e.target.value)}
                                   placeholder="Health" className={inputCls} style={inputSt}/>
                        </div>
                    </div>

                    {/* Icon picker */}
                    <div>
                        <label className={labelCls} style={{color: 'var(--text-muted)'}}>Іконка</label>
                        <div className="relative">
                            <button type="button" onClick={() => setIconOpen(o => !o)}
                                    className={`${inputCls} flex items-center gap-2.5 text-left`} style={inputSt}>
                                <SelectedIcon size={16} color={accent}/>
                                <span>{iconName}</span>
                                <ChevronDown size={14} className="ml-auto" style={{color: 'var(--text-muted)'}}/>
                            </button>
                            {iconOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIconOpen(false)}/>
                                    <div
                                        className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl p-2 shadow-xl max-h-44 overflow-y-auto grid grid-cols-4 gap-1"
                                        style={{background: 'var(--bg-card)', border: '1px solid var(--border-card)'}}>
                                        {ICON_OPTIONS.map(opt => {
                                            const OI = opt.icon;
                                            const sel = opt.name === iconName
                                            return (
                                                <button key={opt.name} type="button"
                                                        onClick={() => {
                                                            setIconName(opt.name);
                                                            setIconOpen(false)
                                                        }}
                                                        className="flex flex-col items-center gap-1 p-2.5 rounded-lg transition-all"
                                                        style={sel ? {
                                                            background: 'var(--admin-nav-active-bg)',
                                                            color: 'var(--admin-nav-active-text)'
                                                        } : {color: 'var(--text-secondary)'}}
                                                        onMouseEnter={e => {
                                                            if (!sel) (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'
                                                        }}
                                                        onMouseLeave={e => {
                                                            if (!sel) (e.currentTarget as HTMLElement).style.background = 'transparent'
                                                        }}>
                                                    <OI size={18}/><span
                                                    className="text-[9px] font-medium">{opt.name}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelCls} style={{color: 'var(--text-muted)'}}><ImageIcon size={10}
                                                                                                    className="inline mr-1"/>URL
                            фото</label>
                        <input value={photo} onChange={e => setPhoto(e.target.value)}
                               placeholder="https://images.unsplash.com/..." className={inputCls} style={inputSt}/>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelCls} style={{color: 'var(--text-muted)'}}><Palette size={10}
                                                                                                      className="inline mr-1"/>Акцент</label>
                            <div className="flex gap-2">
                                <input type="color" value={accent} onChange={e => setAccent(e.target.value)}
                                       className="w-9 h-[42px] rounded-lg cursor-pointer border-0 bg-transparent"/>
                                <input value={accent} onChange={e => setAccent(e.target.value)}
                                       className={`${inputCls} flex-1`} style={inputSt}/>
                            </div>
                        </div>
                        <div>
                            <label className={labelCls} style={{color: 'var(--text-muted)'}}><Palette size={10}
                                                                                                      className="inline mr-1"/>Фон
                                іконки</label>
                            <div className="flex gap-2">
                                <input type="color" value={bg} onChange={e => setBg(e.target.value)}
                                       className="w-9 h-[42px] rounded-lg cursor-pointer border-0 bg-transparent"/>
                                <input value={bg} onChange={e => setBg(e.target.value)} className={`${inputCls} flex-1`}
                                       style={inputSt}/>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className={labelCls} style={{color: 'var(--text-muted)'}}>Послуги (через кому)</label>
                        <input value={services} onChange={e => setServices(e.target.value)}
                               placeholder="Лікарні, Поліклініки, Аптеки" className={inputCls} style={inputSt}/>
                        <p className="text-[11px] mt-1.5" style={{color: 'var(--text-muted)'}}>
                            Підкатегорії та ресурси — на сторінці категорії після збереження
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 justify-end px-6 py-4 shrink-0"
                     style={{borderTop: '1px solid var(--border)'}}>
                    <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-[13px] font-semibold"
                            style={{
                                color: 'var(--text-secondary)',
                                background: 'var(--admin-stat-bg)',
                                border: '1px solid var(--admin-stat-border)'
                            }}>
                        Скасувати
                    </button>
                    <button onClick={() => submit()}
                            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90"
                            style={{background: 'linear-gradient(135deg,#3b82f6,#2563eb)'}}>
                        <Check size={14} className="inline mr-1.5"/>{isEdit ? 'Зберегти' : 'Створити'}
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ─── Delete Confirm ─────────────────────────────────────────── */
function DeleteModal({category, onConfirm, onClose}: {
    category: Category;
    onConfirm: () => void;
    onClose: () => void
}) {
    const Icon = findIcon(category.iconName)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)'}}
             onClick={e => {
                 if (e.target === e.currentTarget) onClose()
             }}>
            <div className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                 style={{background: 'var(--bg-card)', border: '1px solid var(--border-card)'}}>
                <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                         style={{background: 'var(--admin-danger-bg)'}}>
                        <Trash2 size={24} style={{color: 'var(--admin-danger-text)'}}/>
                    </div>
                    <p className="font-bold text-[17px] mb-2" style={{color: 'var(--text-primary)'}}>Видалити
                        категорію?</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                             style={{background: category.bg}}>
                            <Icon size={13} color={category.accent}/>
                        </div>
                        <span className="font-semibold text-[14px]"
                              style={{color: 'var(--text-primary)'}}>{category.title}</span>
                    </div>
                    <p className="text-[13px] mb-6" style={{color: 'var(--text-muted)'}}>
                        Всі підкатегорії та ресурси буде видалено. Дію неможливо скасувати.
                    </p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold"
                                style={{
                                    color: 'var(--text-secondary)',
                                    background: 'var(--admin-stat-bg)',
                                    border: '1px solid var(--admin-stat-border)'
                                }}>
                            Скасувати
                        </button>
                        <button onClick={onConfirm}
                                className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white hover:opacity-90"
                                style={{background: 'linear-gradient(135deg,#ef4444,#dc2626)'}}>
                            Видалити
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}