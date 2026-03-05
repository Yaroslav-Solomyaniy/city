// app/(pages)/admin/logs/page.tsx
'use client'

import React, { useState, useMemo } from 'react'
import {
    ScrollText, Search, X, Plus, Pencil, Trash2,
    ArrowUpDown, LogIn, LogOut, FolderTree, Globe,
    Users, Settings, Filter, ChevronDown,
    AlertCircle, CheckCircle2, Clock,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
type LogAction = 'create' | 'edit' | 'delete' | 'login' | 'logout' | 'invite'
type LogEntity = 'category' | 'resource' | 'subcategory' | 'admin' | 'settings'

interface LogEntry {
    id:         string
    action:     LogAction
    entity:     LogEntity
    entityName: string
    user:       string
    userEmail:  string
    timestamp:  string          // ISO
    details:    string | null
}

/* ─── Mock data ──────────────────────────────────────────────── */
const INITIAL_LOGS: LogEntry[] = [
    { id: '1',  action: 'create', entity: 'resource',    entityName: 'Запис до лікаря онлайн',        user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-04T14:32:00', details: 'Категорія: Здоров\'я' },
    { id: '2',  action: 'edit',   entity: 'category',    entityName: "Здоров'я",                      user: 'Катерина Х.', userEmail: 'kate@cityche.ua',     timestamp: '2026-03-04T13:15:00', details: 'Змінено фото та акцентний колір' },
    { id: '3',  action: 'delete', entity: 'resource',    entityName: 'Застаріле посилання #12',        user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-03-04T11:48:00', details: null },
    { id: '4',  action: 'invite', entity: 'admin',       entityName: 'oleksandr@cityche.ua',           user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-04T10:20:00', details: 'Запрошення надіслано' },
    { id: '5',  action: 'login',  entity: 'admin',       entityName: 'Ярослав С.',                     user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-04T09:01:00', details: null },
    { id: '6',  action: 'create', entity: 'subcategory', entityName: 'Амбулаторії',                    user: 'Катерина Х.', userEmail: 'kate@cityche.ua',     timestamp: '2026-03-03T16:55:00', details: 'Категорія: Здоров\'я' },
    { id: '7',  action: 'edit',   entity: 'resource',    entityName: 'Черкаська обласна лікарня',      user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-03-03T15:30:00', details: 'Оновлено URL та опис' },
    { id: '8',  action: 'create', entity: 'category',    entityName: 'Туризм',                         user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-03T14:10:00', details: null },
    { id: '9',  action: 'delete', entity: 'category',    entityName: 'Туризм',                         user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-03T14:22:00', details: 'Видалено одразу після створення' },
    { id: '10', action: 'login',  entity: 'admin',       entityName: 'Катерина Х.',                    user: 'Катерина Х.', userEmail: 'kate@cityche.ua',     timestamp: '2026-03-03T09:00:00', details: null },
    { id: '11', action: 'edit',   entity: 'category',    entityName: 'Транспорт',                      user: 'Катерина Х.', userEmail: 'kate@cityche.ua',     timestamp: '2026-03-02T17:45:00', details: 'Додано нову послугу' },
    { id: '12', action: 'create', entity: 'resource',    entityName: 'Розклад маршрутів',              user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-03-02T15:20:00', details: 'Категорія: Транспорт → Автобуси' },
    { id: '13', action: 'logout', entity: 'admin',       entityName: 'Дмитро Т.',                      user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-03-02T18:00:00', details: null },
    { id: '14', action: 'edit',   entity: 'resource',    entityName: 'Черкасиводоканал',               user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-03-01T12:33:00', details: 'Оновлено опис' },
    { id: '15', action: 'create', entity: 'subcategory', entityName: 'Електропостачання',              user: 'Катерина Х.', userEmail: 'kate@cityche.ua',     timestamp: '2026-03-01T11:10:00', details: 'Категорія: Комунальні Послуги' },
    { id: '16', action: 'delete', entity: 'subcategory', entityName: 'Старий розділ',                  user: 'Ярослав С.',  userEmail: 'yaroslav@cityche.ua', timestamp: '2026-02-28T16:00:00', details: null },
    { id: '17', action: 'login',  entity: 'admin',       entityName: 'Дмитро Т.',                      user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-02-28T09:15:00', details: null },
    { id: '18', action: 'edit',   entity: 'category',    entityName: 'Міська Рада',                    user: 'Дмитро Т.',   userEmail: 'dmytro@cityche.ua',   timestamp: '2026-02-27T14:50:00', details: 'Оновлено фото' },
]

/* ─── Meta ───────────────────────────────────────────────────── */
const ACTION_META: Record<LogAction, { label: string; icon: React.ElementType; color: string; bg: string }> = {
    create: { label: 'Створення', icon: Plus,      color: '#10b981', bg: 'rgba(16,185,129,.12)'  },
    edit:   { label: 'Редагування', icon: Pencil,  color: '#3b82f6', bg: 'rgba(59,130,246,.12)'  },
    delete: { label: 'Видалення',   icon: Trash2,  color: '#ef4444', bg: 'rgba(239,68,68,.12)'   },
    login:  { label: 'Вхід',        icon: LogIn,   color: '#8b5cf6', bg: 'rgba(139,92,246,.12)'  },
    logout: { label: 'Вихід',       icon: LogOut,  color: '#f59e0b', bg: 'rgba(245,158,11,.12)'  },
    invite: { label: 'Запрошення',  icon: Users,   color: '#06b6d4', bg: 'rgba(6,182,212,.12)'   },
}

const ENTITY_META: Record<LogEntity, { label: string; icon: React.ElementType }> = {
    category:    { label: 'Категорія',    icon: FolderTree },
    resource:    { label: 'Ресурс',       icon: Globe      },
    subcategory: { label: 'Підкатегорія', icon: FolderTree },
    admin:       { label: 'Адмін',        icon: Users      },
    settings:    { label: 'Налаштування', icon: Settings   },
}

const ADMINS = ['Всі', 'Ярослав С.', 'Катерина Х.', 'Дмитро Т.']

function formatTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMin = Math.floor(diffMs / 60000)
    if (diffMin < 1)   return 'Щойно'
    if (diffMin < 60)  return `${diffMin} хв тому`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24)    return `${diffH} год тому`
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function groupByDate(logs: LogEntry[]): { date: string; items: LogEntry[] }[] {
    const map = new Map<string, LogEntry[]>()
    logs.forEach(l => {
        const date = l.timestamp.split('T')[0]
        if (!map.has(date)) map.set(date, [])
        map.get(date)!.push(l)
    })
    return Array.from(map.entries()).map(([date, items]) => ({ date, items }))
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === today.toDateString())     return 'Сьогодні'
    if (d.toDateString() === yesterday.toDateString()) return 'Вчора'
    return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function LogsPage() {
    const [search,       setSearch]       = useState('')
    const [filterAction, setFilterAction] = useState<LogAction | null>(null)
    const [filterAdmin,  setFilterAdmin]  = useState('Всі')
    const [showFilters,  setShowFilters]  = useState(false)

    const filtered = useMemo(() => {
        const q = search.toLowerCase()
        return INITIAL_LOGS.filter(l =>
            (!q || l.entityName.toLowerCase().includes(q) || l.user.toLowerCase().includes(q) || (l.details ?? '').toLowerCase().includes(q)) &&
            (!filterAction || l.action === filterAction) &&
            (filterAdmin === 'Всі' || l.user === filterAdmin)
        )
    }, [search, filterAction, filterAdmin])

    const groups = useMemo(() => groupByDate(filtered), [filtered])

    const activeFilters = [filterAction, filterAdmin !== 'Всі' ? filterAdmin : null].filter(Boolean).length

    return (
        <div className="max-w-[900px] mx-auto">

            {/* ── Header ── */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span><span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Логи дій</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <h1 className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                            Логи дій
                        </h1>
                        <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            {INITIAL_LOGS.length} записів · останні 30 днів
                        </p>
                    </div>
                    {/* Action breakdown */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['create', 'edit', 'delete'] as LogAction[]).map(a => {
                            const m = ACTION_META[a]
                            const count = INITIAL_LOGS.filter(l => l.action === a).length
                            const Icon = m.icon
                            return (
                                <div key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold"
                                     style={{ background: m.bg, color: m.color }}>
                                    <Icon size={12} />{count}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Search + filter bar ── */}
            <div className="flex flex-col gap-3 mb-6">
                <div className="flex gap-3">
                    <div className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 flex-1"
                         style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>
                        <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <input type="text" placeholder="Пошук по об'єкту, користувачу, деталях..."
                               value={search} onChange={e => setSearch(e.target.value)}
                               className="flex-1 bg-transparent text-[13.5px] outline-none"
                               style={{ color: 'var(--text-primary)' }} />
                        {search && <button onClick={() => setSearch('')} style={{ color: 'var(--text-muted)' }}><X size={14} /></button>}
                    </div>
                    <button onClick={() => setShowFilters(f => !f)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                            style={showFilters || activeFilters > 0
                                ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)', border: '1px solid var(--admin-badge-border)' }
                                : { background: 'var(--admin-stat-bg)', color: 'var(--text-secondary)', border: '1px solid var(--admin-stat-border)' }}>
                        <Filter size={14} />
                        Фільтри
                        {activeFilters > 0 && (
                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                                  style={{ background: 'var(--admin-nav-active-text)' }}>
                                {activeFilters}
                            </span>
                        )}
                    </button>
                </div>

                {/* Filter panel */}
                {showFilters && (
                    <div className="rounded-xl p-4 space-y-4"
                         style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}>

                        {/* Action filter */}
                        <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Тип дії</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setFilterAction(null)}
                                        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                        style={!filterAction
                                            ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)', border: '1px solid var(--admin-badge-border)' }
                                            : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                    Всі
                                </button>
                                {(Object.entries(ACTION_META) as [LogAction, typeof ACTION_META[LogAction]][]).map(([action, meta]) => {
                                    const Icon = meta.icon
                                    const active = filterAction === action
                                    return (
                                        <button key={action} onClick={() => setFilterAction(active ? null : action)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                                style={active
                                                    ? { background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44` }
                                                    : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                            <Icon size={12} />{meta.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Admin filter */}
                        <div>
                            <p className="text-[10.5px] font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>Адміністратор</p>
                            <div className="flex flex-wrap gap-2">
                                {ADMINS.map(admin => (
                                    <button key={admin} onClick={() => setFilterAdmin(admin)}
                                            className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                                            style={filterAdmin === admin
                                                ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)', border: '1px solid var(--admin-badge-border)' }
                                                : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                                        {admin}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {activeFilters > 0 && (
                            <button onClick={() => { setFilterAction(null); setFilterAdmin('Всі') }}
                                    className="text-[12px] font-semibold" style={{ color: 'var(--admin-danger-text)' }}>
                                Скинути фільтри
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* ── Empty state ── */}
            {groups.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="font-semibold text-[15px] mb-1" style={{ color: 'var(--text-primary)' }}>Логів не знайдено</p>
                    <button onClick={() => { setSearch(''); setFilterAction(null); setFilterAdmin('Всі') }}
                            className="text-[13px] font-medium" style={{ color: 'var(--text-accent)' }}>
                        Скинути фільтри
                    </button>
                </div>
            )}

            {/* ── Log groups ── */}
            <div className="space-y-6">
                {groups.map(group => (
                    <div key={group.date}>
                        {/* Date divider */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                            <span className="text-[11.5px] font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                                  style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-muted)' }}>
                                {formatDate(group.date)}
                            </span>
                            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                        </div>

                        {/* Log entries */}
                        <div className="rounded-2xl overflow-hidden"
                             style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}>
                            {group.items.map((log, idx) => {
                                const am = ACTION_META[log.action]
                                const em = ENTITY_META[log.entity]
                                const AIcon = am.icon
                                const EIcon = em.icon
                                const isLast = idx === group.items.length - 1

                                return (
                                    <div key={log.id}
                                         className="flex items-start gap-4 px-5 py-4 transition-colors"
                                         style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}
                                         onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                         onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>

                                        {/* Action icon */}
                                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                             style={{ background: am.bg }}>
                                            <AIcon size={14} color={am.color} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center flex-wrap gap-1.5">
                                                {/* User */}
                                                <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                    {log.user}
                                                </span>
                                                {/* Action label */}
                                                <span className="text-[12px] font-medium px-1.5 py-0.5 rounded-md"
                                                      style={{ background: am.bg, color: am.color }}>
                                                    {am.label.toLowerCase()}
                                                </span>
                                                {/* Entity type */}
                                                <span className="text-[11.5px] inline-flex items-center gap-1"
                                                      style={{ color: 'var(--text-muted)' }}>
                                                    <EIcon size={10} />{em.label.toLowerCase()}
                                                </span>
                                                {/* Entity name */}
                                                <span className="text-[13px] font-semibold truncate max-w-[200px]"
                                                      style={{ color: 'var(--text-accent)' }}>
                                                    «{log.entityName}»
                                                </span>
                                            </div>
                                            {log.details && (
                                                <p className="text-[12px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                                    {log.details}
                                                </p>
                                            )}
                                        </div>

                                        {/* Time */}
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                                            <span className="text-[12px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                                                {new Date(log.timestamp).toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length > 0 && (
                <p className="text-center text-[12px] mt-6" style={{ color: 'var(--text-muted)' }}>
                    Показано {filtered.length} з {INITIAL_LOGS.length} записів
                </p>
            )}
        </div>
    )
}