// app/(pages)/admin/feedback/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
    MessageSquare, Search, X, Check, Clock,
    ChevronDown, Eye, Trash2, MoreHorizontal,
    AlertCircle, ThumbsUp, PlusCircle, MinusCircle,
    ArrowUpDown, Mail, User, Calendar,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
type FeedbackType = 'feedback' | 'add-resource' | 'remove-resource' | 'add-category'
type FeedbackStatus = 'new' | 'reviewed' | 'resolved'

interface Feedback {
    id:        string
    type:      FeedbackType
    subject:   string
    message:   string
    author:    string
    email:     string
    date:      string
    status:    FeedbackStatus
}

/* ─── Mock data ──────────────────────────────────────────────── */
const INITIAL: Feedback[] = [
    { id: '1', type: 'feedback',        subject: 'Не працює посилання на поліклініку',    message: 'Перейшов за посиланням на сторінці "Здоров\'я" до поліклініки №3 — сторінка не відкривається, помилка 404.',                                   author: 'Іван Петренко',    email: 'ivan@gmail.com',    date: '2026-03-02', status: 'new'      },
    { id: '2', type: 'add-resource',    subject: 'Додати Черкаський зоопарк',             message: 'Пропоную додати Черкаський зоопарк до розділу дозвілля. Офіційний сайт: https://zoo.ck.ua. Там є інформація про години роботи та вхід.',           author: 'Марія Коваль',     email: 'maria@ukr.net',     date: '2026-03-01', status: 'new'      },
    { id: '3', type: 'feedback',        subject: 'Дякую за зручний портал!',              message: 'Хочу подякувати команді за чудовий міський портал. Знайшла всі потрібні контакти за 2 хвилини. Дуже зручно!',                                    author: 'Олена Василенко',  email: 'olena@gmail.com',   date: '2026-02-28', status: 'reviewed' },
    { id: '4', type: 'remove-resource', subject: 'Видалити застарілий ресурс',            message: 'Посилання на "Черкаське BTI" в розділі "Документи" веде на неіснуючий сайт. Організація реорганізована у 2023 році.',                              author: 'Петро Дяченко',    email: 'petro@meta.ua',     date: '2026-02-27', status: 'resolved' },
    { id: '5', type: 'add-category',    subject: 'Додати категорію "Дозвілля"',           message: 'На порталі не вистачає розділу про культуру та дозвілля: театри, кіно, парки, музеї. Вважаю, що це важлива інформація для мешканців міста.',      author: 'Тетяна Мороз',     email: 'tanya@gmail.com',   date: '2026-02-25', status: 'new'      },
    { id: '6', type: 'feedback',        subject: 'Помилка в адресі лікарні №2',           message: 'На сторінці лікарні №2 вказана неправильна адреса. Правильна адреса: вул. Смілянська, 78, а не 87 як написано.',                                   author: 'Василь Гриценко',  email: 'vasyl@ukr.net',     date: '2026-02-22', status: 'resolved' },
    { id: '7', type: 'add-resource',    subject: 'Додати розклад електричок',             message: 'Було б зручно додати посилання на розклад приміських електричок. Офіційний сайт Укрзалізниці: https://uz.gov.ua.',                                  author: 'Андрій Шевченко',  email: 'andriy@gmail.com',  date: '2026-02-20', status: 'reviewed' },
    { id: '8', type: 'feedback',        subject: 'Не можу знайти графік вивозу сміття',   message: 'Шукав інформацію про графік вивозу сміття по вулицях — не знайшов. Можливо варто додати такий розділ або посилання на відповідну сторінку.',       author: 'Наталія Бондар',   email: 'natalia@meta.ua',   date: '2026-02-18', status: 'new'      },
    { id: '9', type: 'remove-resource', subject: 'Аптека "Здоров\'я" закрилась',          message: 'Аптека "Здоров\'я" на вул. Хрещатик, 12 закрилась ще у грудні 2025. Прошу видалити її з переліку аптек.',                                         author: 'Людмила Савченко', email: 'lyuda@gmail.com',    date: '2026-02-15', status: 'new'      },
    { id: '10',type: 'feedback',        subject: 'Пропозиція: мобільний застосунок',      message: 'Дуже зручний сайт! Хотілося б мати мобільний застосунок для зручнішого користування. Чи плануєте розробку?',                                      author: 'Роман Ковальчук',  email: 'roman@ukr.net',     date: '2026-02-10', status: 'reviewed' },
]

/* ─── Helpers ────────────────────────────────────────────────── */
const TYPE_META: Record<FeedbackType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    'feedback':        { label: 'Відгук',          icon: MessageSquare, color: '#3b82f6', bg: 'rgba(59,130,246,.12)'  },
    'add-resource':    { label: 'Додати ресурс',   icon: PlusCircle,    color: '#10b981', bg: 'rgba(16,185,129,.12)'  },
    'remove-resource': { label: 'Видалити ресурс', icon: MinusCircle,   color: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
    'add-category':    { label: 'Нова категорія',  icon: PlusCircle,    color: '#8b5cf6', bg: 'rgba(139,92,246,.12)'  },
}

const STATUS_META: Record<FeedbackStatus, { label: string; color: string; bg: string }> = {
    'new':      { label: 'Нове',        color: 'var(--admin-warning-text)', bg: 'var(--admin-warning-bg)' },
    'reviewed': { label: 'Переглянуто', color: 'var(--admin-badge-text)',   bg: 'var(--admin-badge-bg)'   },
    'resolved': { label: 'Вирішено',    color: 'var(--admin-success-text)', bg: 'var(--admin-success-bg)' },
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function FeedbackPage() {
    const [items,     setItems]     = useState<Feedback[]>(INITIAL)
    const [search,    setSearch]    = useState('')
    const [filterType,   setFilterType]   = useState<FeedbackType | null>(null)
    const [filterStatus, setFilterStatus] = useState<FeedbackStatus | null>(null)
    const [sortDir,   setSortDir]   = useState<'asc' | 'desc'>('desc')
    const [openMenu,  setOpenMenu]  = useState<string | null>(null)
    const [viewItem,  setViewItem]  = useState<Feedback | null>(null)
    const [deleteId,  setDeleteId]  = useState<string | null>(null)

    /* ── computed ── */
    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return items
            .filter(i =>
                (!q || i.subject.toLowerCase().includes(q) || i.author.toLowerCase().includes(q) || i.message.toLowerCase().includes(q)) &&
                (!filterType   || i.type   === filterType) &&
                (!filterStatus || i.status === filterStatus)
            )
            .sort((a, b) => {
                const cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
                return sortDir === 'asc' ? cmp : -cmp
            })
    }, [items, search, filterType, filterStatus, sortDir])

    const newCount = items.filter(i => i.status === 'new').length

    /* ── actions ── */
    const setStatus = (id: string, status: FeedbackStatus) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
        if (viewItem?.id === id) setViewItem(v => v ? { ...v, status } : v)
    }
    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
        setDeleteId(null)
        if (viewItem?.id === id) setViewItem(null)
    }

    return (
        <div className="max-w-[1200px] mx-auto">

            {/* ── Header ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span><span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Зворотній зв'язок</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <h1 className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                            Зворотній зв'язок
                        </h1>
                        <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {items.length} звернень · {newCount} нових
                        </p>
                    </div>
                    {newCount > 0 && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold shrink-0"
                             style={{ background: 'var(--admin-warning-bg)', color: 'var(--admin-warning-text)' }}>
                            <AlertCircle size={15} />
                            {newCount} нових звернень потребують уваги
                        </div>
                    )}
                </div>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {(Object.entries(TYPE_META) as [FeedbackType, typeof TYPE_META[FeedbackType]][]).map(([type, meta]) => {
                    const Icon = meta.icon
                    const count = items.filter(i => i.type === type).length
                    const active = filterType === type
                    return (
                        <button key={type} onClick={() => setFilterType(active ? null : type)}
                                className="rounded-xl px-4 py-3 text-left transition-all"
                                style={{
                                    background: active ? meta.bg : 'var(--admin-stat-bg)',
                                    border: `1px solid ${active ? meta.color + '44' : 'var(--admin-stat-border)'}`,
                                }}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: meta.bg }}>
                                    <Icon size={13} color={meta.color} />
                                </div>
                                {active && <X size={13} style={{ color: meta.color }} />}
                            </div>
                            <p className="text-[20px] font-bold m-0" style={{ fontFamily: 'var(--font-display)', color: active ? meta.color : 'var(--text-primary)' }}>{count}</p>
                            <p className="text-[11px] m-0 mt-0.5" style={{ color: active ? meta.color + 'bb' : 'var(--text-muted)' }}>{meta.label}</p>
                        </button>
                    )
                })}
            </div>

            {/* ── Search + filters ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 flex-1"
                     style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                    <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input type="text" placeholder="Пошук за темою, автором, текстом..."
                           value={search} onChange={e => setSearch(e.target.value)}
                           className="flex-1 bg-transparent text-[13.5px] outline-none"
                           style={{ color: 'var(--text-primary)' }} />
                    {search && <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}><X size={14} /></button>}
                </div>

                {/* Status filter */}
                <div className="flex gap-2">
                    {(Object.entries(STATUS_META) as [FeedbackStatus, typeof STATUS_META[FeedbackStatus]][]).map(([st, meta]) => (
                        <button key={st} onClick={() => setFilterStatus(filterStatus === st ? null : st)}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all"
                                style={filterStatus === st
                                    ? { background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44` }
                                    : { background: 'var(--admin-stat-bg)', color: 'var(--text-muted)', border: '1px solid var(--admin-stat-border)' }}>
                            {meta.label}
                        </button>
                    ))}
                    <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all"
                            style={{ background: 'var(--admin-stat-bg)', color: 'var(--text-muted)', border: '1px solid var(--admin-stat-border)' }}>
                        <ArrowUpDown size={12} />{sortDir === 'desc' ? 'Нові спочатку' : 'Старі спочатку'}
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="rounded-2xl overflow-hidden"
                 style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[680px]">
                        <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            {['Тема', 'Тип', 'Автор', 'Дата', 'Статус', ''].map(h => (
                                <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3.5"
                                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.length === 0 && (
                            <tr><td colSpan={6} className="text-center py-16">
                                <p className="text-3xl mb-2">📭</p>
                                <p className="font-semibold text-[14px] mb-1" style={{ color: 'var(--text-primary)' }}>Звернень не знайдено</p>
                                <button onClick={() => { setSearch(''); setFilterType(null); setFilterStatus(null) }}
                                        className="text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>
                                    Скинути фільтри
                                </button>
                            </td></tr>
                        )}
                        {filtered.map(item => {
                            const tm = TYPE_META[item.type]
                            const sm = STATUS_META[item.status]
                            const TIcon = tm.icon
                            return (
                                <tr key={item.id}
                                    className="cursor-pointer transition-colors"
                                    style={{ borderBottom: '1px solid var(--border)' }}
                                    onClick={() => setViewItem(item)}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                                    {/* Subject */}
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            {item.status === 'new' && (
                                                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--admin-warning-text)' }} />
                                            )}
                                            <p className="text-[13.5px] font-semibold m-0 truncate max-w-[260px]"
                                               style={{ color: 'var(--text-primary)' }}>
                                                {item.subject}
                                            </p>
                                        </div>
                                        <p className="text-[11.5px] m-0 mt-0.5 truncate max-w-[260px] pl-3.5"
                                           style={{ color: 'var(--text-muted)' }}>
                                            {item.message}
                                        </p>
                                    </td>

                                    {/* Type */}
                                    <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                                                  style={{ background: tm.bg, color: tm.color }}>
                                                <TIcon size={10} />{tm.label}
                                            </span>
                                    </td>

                                    {/* Author */}
                                    <td className="px-5 py-3.5 hidden sm:table-cell">
                                        <p className="text-[13px] font-medium m-0" style={{ color: 'var(--text-secondary)' }}>{item.author}</p>
                                        <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>{item.email}</p>
                                    </td>

                                    {/* Date */}
                                    <td className="px-5 py-3.5 hidden md:table-cell">
                                            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                    </td>

                                    {/* Status */}
                                    <td className="px-5 py-3.5">
                                            <span className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                                                  style={{ background: sm.bg, color: sm.color }}>
                                                {sm.label}
                                            </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                                        <div className="relative">
                                            <button onClick={() => setOpenMenu(openMenu === item.id ? null : item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                                    style={{ color: 'var(--text-muted)' }}
                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                <MoreHorizontal size={16} />
                                            </button>
                                            {openMenu === item.id && (
                                                <>
                                                    <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />
                                                    <div className="absolute right-0 top-full mt-1 z-40 w-48 rounded-xl py-1.5 shadow-xl"
                                                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                                                        <button onClick={() => { setViewItem(item); setOpenMenu(null) }}
                                                                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium text-left"
                                                                style={{ color: 'var(--text-secondary)' }}
                                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                            <Eye size={14} /> Переглянути
                                                        </button>
                                                        {item.status !== 'reviewed' && (
                                                            <button onClick={() => { setStatus(item.id, 'reviewed'); setOpenMenu(null) }}
                                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium text-left"
                                                                    style={{ color: 'var(--text-secondary)' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                                <Clock size={14} /> Позначити як переглянуте
                                                            </button>
                                                        )}
                                                        {item.status !== 'resolved' && (
                                                            <button onClick={() => { setStatus(item.id, 'resolved'); setOpenMenu(null) }}
                                                                    className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium text-left"
                                                                    style={{ color: 'var(--admin-success-text)' }}
                                                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                                <Check size={14} /> Позначити як вирішене
                                                            </button>
                                                        )}
                                                        <div style={{ borderTop: '1px solid var(--border)', margin: '4px 0' }} />
                                                        <button onClick={() => { setDeleteId(item.id); setOpenMenu(null) }}
                                                                className="flex items-center gap-2.5 w-full px-3.5 py-2 text-[13px] font-medium text-left"
                                                                style={{ color: 'var(--admin-danger-text)' }}
                                                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                                                            <Trash2 size={14} /> Видалити
                                                        </button>
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
                <div className="px-5 py-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>
                        Показано {filtered.length} з {items.length} звернень
                    </p>
                </div>
            </div>

            {/* ── View modal ── */}
            {viewItem && (
                <ViewModal
                    item={viewItem}
                    onClose={() => setViewItem(null)}
                    onSetStatus={setStatus}
                    onDelete={(id) => { setDeleteId(id); setViewItem(null) }}
                />
            )}

            {/* ── Delete confirm ── */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                     style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }}
                     onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}>
                    <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl text-center"
                         style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                             style={{ background: 'var(--admin-danger-bg)' }}>
                            <Trash2 size={24} style={{ color: 'var(--admin-danger-text)' }} />
                        </div>
                        <p className="font-bold text-[17px] mb-2" style={{ color: 'var(--text-primary)' }}>Видалити звернення?</p>
                        <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>Цю дію неможливо скасувати.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteId(null)}
                                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                                    style={{ color: 'var(--text-secondary)', background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                                Скасувати
                            </button>
                            <button onClick={() => deleteItem(deleteId)}
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
   VIEW MODAL
   ═══════════════════════════════════════════════════════════════ */
function ViewModal({ item, onClose, onSetStatus, onDelete }: {
    item:        Feedback
    onClose:     () => void
    onSetStatus: (id: string, s: FeedbackStatus) => void
    onDelete:    (id: string) => void
}) {
    const tm = TYPE_META[item.type]
    const sm = STATUS_META[item.status]
    const TIcon = tm.icon

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(6px)' }}
             onClick={e => { if (e.target === e.currentTarget) onClose() }}>
            <div className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                 style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}>

                {/* Accent bar */}
                <div className="h-1 shrink-0" style={{ background: tm.color }} />

                {/* Header */}
                <div className="px-6 py-4 flex items-start justify-between gap-3 shrink-0"
                     style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="flex items-start gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: tm.bg }}>
                            <TIcon size={16} color={tm.color} />
                        </div>
                        <div className="min-w-0">
                            <p className="font-bold text-[15px] m-0 leading-snug" style={{ color: 'var(--text-primary)' }}>
                                {item.subject}
                            </p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: tm.bg, color: tm.color }}>{tm.label}</span>
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{ background: sm.bg, color: sm.color }}>{sm.label}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
                            style={{ color: 'var(--text-muted)' }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* Author */}
                    <div className="flex items-center gap-3 p-4 rounded-xl"
                         style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                             style={{ background: 'rgba(139,92,246,.12)', color: '#8b5cf6', fontWeight: 700, fontSize: 13 }}>
                            {item.author[0]}
                        </div>
                        <div>
                            <p className="font-semibold text-[13.5px] m-0" style={{ color: 'var(--text-primary)' }}>{item.author}</p>
                            <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>{item.email}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5 shrink-0">
                            <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                {new Date(item.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Повідомлення</p>
                        <p className="text-[14px] leading-relaxed m-0 whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                            {item.message}
                        </p>
                    </div>
                </div>

                {/* Footer: status actions */}
                <div className="px-6 py-4 shrink-0 flex flex-wrap gap-2"
                     style={{ borderTop: '1px solid var(--border)' }}>
                    {item.status !== 'reviewed' && (
                        <button onClick={() => onSetStatus(item.id, 'reviewed')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)' }}>
                            <Clock size={14} /> Переглянуто
                        </button>
                    )}
                    {item.status !== 'resolved' && (
                        <button onClick={() => onSetStatus(item.id, 'resolved')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--admin-success-bg)', color: 'var(--admin-success-text)' }}>
                            <Check size={14} /> Вирішено
                        </button>
                    )}
                    {item.status !== 'new' && (
                        <button onClick={() => onSetStatus(item.id, 'new')}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80"
                                style={{ background: 'var(--admin-warning-bg)', color: 'var(--admin-warning-text)' }}>
                            <AlertCircle size={14} /> Повернути як нове
                        </button>
                    )}
                    <button onClick={() => onDelete(item.id)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all hover:opacity-80 ml-auto"
                            style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger-text)' }}>
                        <Trash2 size={14} /> Видалити
                    </button>
                </div>
            </div>
        </div>
    )
}