'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    FolderTree, Globe, Users, MessageSquare,
    TrendingUp, TrendingDown, Eye, Clock,
    ArrowRight, Plus, ExternalLink,
    Activity, AlertCircle, CheckCircle2, XCircle,
    UserPlus, FileEdit, Trash2,
} from 'lucide-react'

/* ─── Mock Data ──────────────────────────────────────────────── */
const STATS = [
    { label: 'Категорій',      value: 12,   change: '+2',  trend: 'up'   as const, icon: FolderTree,    accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    { label: 'Ресурсів',       value: 48,   change: '+5',  trend: 'up'   as const, icon: Globe,         accent: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    { label: 'Адміністраторів', value: 4,    change: '0',   trend: 'neutral' as const, icon: Users,     accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    { label: 'Звернень',       value: 23,   change: '+8',  trend: 'up'   as const, icon: MessageSquare, accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
]

const RECENT_ACTIVITY = [
    { id: 1, type: 'add'    as const, entity: 'Черкаська обласна лікарня', entityType: 'ресурс',   user: 'Ярослав С.',  time: '5 хв тому' },
    { id: 2, type: 'edit'   as const, entity: "Здоров'я",                  entityType: 'категорія', user: 'Катерина Х.', time: '23 хв тому' },
    { id: 3, type: 'delete' as const, entity: 'Застаріле посилання #12',   entityType: 'ресурс',   user: 'Дмитро Т.',   time: '1 год тому' },
    { id: 4, type: 'add'    as const, entity: 'Олександр С.',              entityType: 'адмін',    user: 'Ярослав С.',  time: '2 год тому' },
    { id: 5, type: 'edit'   as const, entity: 'Транспорт',                 entityType: 'категорія', user: 'Катерина Х.', time: '3 год тому' },
    { id: 6, type: 'add'    as const, entity: 'Маршрутки Черкас',          entityType: 'ресурс',   user: 'Дмитро Т.',   time: '5 год тому' },
]

const RECENT_FEEDBACK = [
    { id: 1, type: 'feedback'     as const, subject: 'Не працює посилання на поліклініку', author: 'Іван П.',    date: '02.03.2026', status: 'new'      as const },
    { id: 2, type: 'add-resource' as const, subject: 'Додати Черкаський зоопарк',          author: 'Марія К.',   date: '01.03.2026', status: 'new'      as const },
    { id: 3, type: 'feedback'     as const, subject: 'Дякую за зручний портал!',           author: 'Олена В.',   date: '28.02.2026', status: 'reviewed'  as const },
    { id: 4, type: 'remove-resource' as const, subject: 'Видалити застарілий ресурс',     author: 'Петро Д.',   date: '27.02.2026', status: 'resolved' as const },
]

const POPULAR_CATEGORIES = [
    { name: "Здоров'я",          views: 1842, accent: '#ef4444' },
    { name: 'Освіта',             views: 1456, accent: '#3b82f6' },
    { name: 'Транспорт',          views: 1203, accent: '#f97316' },
    { name: 'Міська Рада',        views: 987,  accent: '#f59e0b' },
    { name: 'Комунальні Послуги', views: 845,  accent: '#10b981' },
]

/* ─── Helpers ────────────────────────────────────────────────── */
const activityIcon = (type: 'add' | 'edit' | 'delete') => {
    switch (type) {
        case 'add':    return { icon: Plus,     color: '#10b981', bg: 'rgba(16,185,129,0.12)' }
        case 'edit':   return { icon: FileEdit, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' }
        case 'delete': return { icon: Trash2,   color: '#ef4444', bg: 'rgba(239,68,68,0.12)' }
    }
}

const statusInfo = (status: 'new' | 'reviewed' | 'resolved') => {
    switch (status) {
        case 'new':      return { label: 'Нове',        color: 'var(--admin-warning-text)', bg: 'var(--admin-warning-bg)' }
        case 'reviewed':  return { label: 'Переглянуто', color: 'var(--admin-badge-text)',   bg: 'var(--admin-badge-bg)' }
        case 'resolved': return { label: 'Вирішено',    color: 'var(--admin-success-text)', bg: 'var(--admin-success-bg)' }
    }
}

const feedbackTypeLabel = (type: string) => {
    switch (type) {
        case 'feedback':        return 'Відгук'
        case 'add-resource':    return 'Додати ресурс'
        case 'remove-resource': return 'Видалити ресурс'
        case 'add-category':    return 'Нова категорія'
        default: return type
    }
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdminDashboard() {
    const [period] = useState<'today' | 'week' | 'month'>('week')

    const maxViews = Math.max(...POPULAR_CATEGORIES.map(c => c.views))

    return (
        <div className="max-w-[1400px] mx-auto">
            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span>
                    <span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Дашборд</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                        <h1
                            className="text-[clamp(24px,3vw,36px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Дашборд
                        </h1>
                        <p className="text-[14px] mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Огляд стану порталу та останніх змін
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center gap-1 px-1 py-1 rounded-xl"
                            style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)' }}
                        >
                            {(['today', 'week', 'month'] as const).map(p => (
                                <button
                                    key={p}
                                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150"
                                    style={period === p
                                        ? { background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)' }
                                        : { color: 'var(--text-muted)' }
                                    }
                                >
                                    {p === 'today' ? 'Сьогодні' : p === 'week' ? 'Тиждень' : 'Місяць'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Stats cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                {STATS.map(stat => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="rounded-2xl p-5 transition-all duration-200"
                            style={{
                                background: 'var(--admin-stat-bg)',
                                border: '1px solid var(--admin-stat-border)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = 'var(--admin-stat-hover)'
                                ;(e.currentTarget as HTMLElement).style.borderColor = stat.accent + '30'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = 'var(--admin-stat-bg)'
                                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-stat-border)'
                            }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ background: stat.bg }}
                                >
                                    <Icon size={19} color={stat.accent} strokeWidth={1.7} />
                                </div>
                                {stat.trend !== 'neutral' && (
                                    <div
                                        className="flex items-center gap-1 text-[12px] font-semibold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: stat.trend === 'up' ? 'var(--admin-success-bg)' : 'var(--admin-danger-bg)',
                                            color: stat.trend === 'up' ? 'var(--admin-success-text)' : 'var(--admin-danger-text)',
                                        }}
                                    >
                                        {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                        {stat.change}
                                    </div>
                                )}
                            </div>
                            <p className="text-[28px] font-bold m-0 leading-none mb-1"
                               style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                                {stat.value}
                            </p>
                            <p className="text-[13px] m-0" style={{ color: 'var(--text-muted)' }}>
                                {stat.label}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* ── Main grid: Activity + Feedback ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

                {/* Recent Activity */}
                <div
                    className="xl:col-span-2 rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
                >
                    <div className="flex items-center justify-between px-5 py-4"
                         style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                 style={{ background: 'rgba(59,130,246,0.12)' }}>
                                <Activity size={15} color="#3b82f6" />
                            </div>
                            <div>
                                <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                                    Остання активність
                                </p>
                                <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                    Дії адміністраторів на порталі
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/logs"
                            className="flex items-center gap-1 text-[12px] font-semibold no-underline transition-colors"
                            style={{ color: 'var(--text-accent)' }}
                        >
                            Всі логи <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {RECENT_ACTIVITY.map(item => {
                            const ai = activityIcon(item.type)
                            const AIIcon = ai.icon
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
                                        style={{ background: ai.bg }}
                                    >
                                        <AIIcon size={14} color={ai.color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] m-0 leading-snug" style={{ color: 'var(--text-primary)' }}>
                                            <span className="font-semibold">{item.user}</span>
                                            {' '}
                                            {item.type === 'add' ? 'додав' : item.type === 'edit' ? 'змінив' : 'видалив'}
                                            {' '}
                                            <span className="font-medium" style={{ color: 'var(--text-accent)' }}>
                                                {item.entity}
                                            </span>
                                        </p>
                                        <p className="text-[11px] m-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
                                            {item.entityType}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                                        <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Popular categories */}
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-chart-bg)', border: '1px solid var(--admin-chart-border)' }}
                >
                    <div className="flex items-center justify-between px-5 py-4"
                         style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                 style={{ background: 'rgba(139,92,246,0.12)' }}>
                                <Eye size={15} color="#8b5cf6" />
                            </div>
                            <div>
                                <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                                    Популярні категорії
                                </p>
                                <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                    За кількістю переглядів
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="px-5 py-4 space-y-3.5">
                        {POPULAR_CATEGORIES.map((cat, i) => (
                            <div key={cat.name}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold w-4 text-center"
                                              style={{ color: 'var(--text-muted)' }}>
                                            {i + 1}
                                        </span>
                                        <span className="text-[13px] font-medium"
                                              style={{ color: 'var(--text-primary)' }}>
                                            {cat.name}
                                        </span>
                                    </div>
                                    <span className="text-[12px] font-semibold"
                                          style={{ color: cat.accent }}>
                                        {cat.views.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden"
                                     style={{ background: 'var(--border)' }}>
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(cat.views / maxViews) * 100}%`,
                                            background: cat.accent,
                                            opacity: 0.8,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Feedback + Quick actions ── */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* Recent feedback */}
                <div
                    className="xl:col-span-2 rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
                >
                    <div className="flex items-center justify-between px-5 py-4"
                         style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                                 style={{ background: 'rgba(245,158,11,0.12)' }}>
                                <MessageSquare size={15} color="#f59e0b" />
                            </div>
                            <div>
                                <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                                    Останні звернення
                                </p>
                                <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                    Зворотній зв&apos;язок від користувачів
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/feedback"
                            className="flex items-center gap-1 text-[12px] font-semibold no-underline transition-colors"
                            style={{ color: 'var(--text-accent)' }}
                        >
                            Всі звернення <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse min-w-[500px]">
                            <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                {['Тема', 'Тип', 'Автор', 'Дата', 'Статус'].map(h => (
                                    <th
                                        key={h}
                                        className="text-left text-[11px] font-semibold uppercase tracking-wider px-5 py-3"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {RECENT_FEEDBACK.map(fb => {
                                const si = statusInfo(fb.status)
                                return (
                                    <tr
                                        key={fb.id}
                                        className="transition-colors cursor-pointer"
                                        style={{ borderBottom: '1px solid var(--border)' }}
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                    >
                                        <td className="px-5 py-3">
                                            <p className="text-[13px] font-medium m-0 line-clamp-1"
                                               style={{ color: 'var(--text-primary)' }}>
                                                {fb.subject}
                                            </p>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                                  style={{ background: 'var(--admin-badge-bg)', color: 'var(--admin-badge-text)' }}>
                                                {feedbackTypeLabel(fb.type)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[12.5px]" style={{ color: 'var(--text-secondary)' }}>
                                                {fb.author}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                                {fb.date}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                                                style={{ background: si.bg, color: si.color }}
                                            >
                                                {si.label}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick actions */}
                <div
                    className="rounded-2xl p-5"
                    style={{ background: 'var(--admin-chart-bg)', border: '1px solid var(--admin-chart-border)' }}
                >
                    <p className="text-xs font-semibold tracking-widest uppercase mb-4"
                       style={{ color: 'var(--text-accent)' }}>
                        Швидкі дії
                    </p>
                    <div className="flex flex-col gap-2.5">
                        {[
                            { label: 'Додати категорію',    href: '/admin/categories', icon: FolderTree, accent: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                            { label: 'Додати ресурс',       href: '/admin/resources',  icon: Globe,      accent: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                            { label: 'Додати адміністратора',href: '/admin/administrators', icon: UserPlus, accent: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
                            { label: 'Переглянути портал',  href: '/',                 icon: ExternalLink,accent: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
                        ].map(action => {
                            const AIcon = action.icon
                            return (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-150 no-underline"
                                    style={{
                                        background: 'var(--admin-stat-bg)',
                                        border: '1px solid var(--admin-stat-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--admin-stat-hover)'
                                        ;(e.currentTarget as HTMLElement).style.borderColor = action.accent + '30'
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--admin-stat-bg)'
                                        ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--admin-stat-border)'
                                    }}
                                >
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ background: action.bg }}
                                    >
                                        <AIcon size={17} color={action.accent} strokeWidth={1.7} />
                                    </div>
                                    <span className="text-[13.5px] font-semibold">{action.label}</span>
                                    <ArrowRight size={14} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
                                </Link>
                            )
                        })}
                    </div>

                    {/* System status */}
                    <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3"
                           style={{ color: 'var(--text-muted)' }}>
                            Стан системи
                        </p>
                        <div className="flex flex-col gap-2">
                            {[
                                { label: 'Портал',     status: 'ok'      as const },
                                { label: 'База даних', status: 'ok'      as const },
                                { label: 'Пошук',      status: 'warning' as const },
                            ].map(sys => (
                                <div key={sys.label} className="flex items-center gap-2.5">
                                    {sys.status === 'ok' ? (
                                        <CheckCircle2 size={14} color="#10b981" />
                                    ) : sys.status === 'warning' ? (
                                        <AlertCircle size={14} color="#f59e0b" />
                                    ) : (
                                        <XCircle size={14} color="#ef4444" />
                                    )}
                                    <span className="text-[12.5px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                                        {sys.label}
                                    </span>
                                    <span
                                        className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                        style={{
                                            background: sys.status === 'ok' ? 'var(--admin-success-bg)' : sys.status === 'warning' ? 'var(--admin-warning-bg)' : 'var(--admin-danger-bg)',
                                            color: sys.status === 'ok' ? 'var(--admin-success-text)' : sys.status === 'warning' ? 'var(--admin-warning-text)' : 'var(--admin-danger-text)',
                                        }}
                                    >
                                        {sys.status === 'ok' ? 'Працює' : sys.status === 'warning' ? 'Увага' : 'Помилка'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}