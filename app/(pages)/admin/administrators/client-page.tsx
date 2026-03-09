// app/(pages)/admin/administrators/administrators-client.tsx
'use client'

import React, { useState } from 'react'
import {
    Users, Plus, Mail, Trash2, Clock,
    CheckCircle2, XCircle, Copy, Check,
    X, AlertCircle, Ghost,
} from 'lucide-react'
import { getAdministrators } from '@/app/actions/admin/administrators/get-admins'
import { formatLastSeen } from '@/app/lib/format-date'
import {Breadcrumb} from "@/app/components/ui/Breadcrumb";
import Empty from "@/app/components/ui/empty";
import {ROUTES} from "@/app/constants/routes";


/* ─── Types ──────────────────────────────────────────────────── */
type Admin  = Awaited<ReturnType<typeof getAdministrators>>['admins'][number]
type Invite = Awaited<ReturnType<typeof getAdministrators>>['invites'][number]

interface Props {
    admins:  Admin[]
    invites: Invite[]
}

/* ─── Helpers ────────────────────────────────────────────────── */
function isOnline(date: Date | null): boolean {
    if (!date) return false
    return Date.now() - new Date(date).getTime() < 5 * 60_000
}

/* ─── Component ──────────────────────────────────────────────── */
export function AdministratorsClient({ admins: initialAdmins, invites: initialInvites }: Props) {
    const [admins]  = useState<Admin[]>(initialAdmins)
    const [invites, setInvites] = useState<Invite[]>(initialInvites)

    const [modalOpen,     setModalOpen]     = useState(false)
    const [inviteEmail,   setInviteEmail]   = useState('')
    const [inviteLoading, setInviteLoading] = useState(false)
    const [inviteError,   setInviteError]   = useState('')
    const [newInvite,     setNewInvite]     = useState<Invite | null>(null)

    const [deleteId,      setDeleteId]      = useState<string | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [copied, setCopied] = useState<string | null>(null)

    function openModal() {
        setInviteEmail('')
        setInviteError('')
        setNewInvite(null)
        setModalOpen(true)
    }

    async function handleInvite(e: React.FormEvent) {
        e.preventDefault()
        setInviteError('')
        setInviteLoading(true)
        try {
            const res = await fetch('/api/admin/invite', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify({ email: inviteEmail }),
            })
            const data = await res.json()
            if (!res.ok) { setInviteError(data.error ?? 'Щось пішло не так'); return }
            setNewInvite(data.invite)
            setInvites(prev => [data.invite, ...prev])
        } catch {
            setInviteError('Помилка мережі. Спробуй ще раз.')
        } finally {
            setInviteLoading(false)
        }
    }

    function handleRevokeInvite(id: string) {
        setInvites(prev => prev.filter(i => i.id !== id))
    }

    async function handleDeleteAdmin() {
        if (!deleteId) return
        setDeleteLoading(true)
        await new Promise(r => setTimeout(r, 600))
        setDeleteLoading(false)
        setDeleteId(null)
    }

    function copyLink(link: string, id: string) {
        navigator.clipboard.writeText(link)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="max-w-240 mx-auto">

            {/* ── Header ── */}
            <div className="mb-10 mt-5">
                <Breadcrumb items={[ROUTES.ADMIN.ROOT, ROUTES.ADMIN.ADMINISTRATORS]}/>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1
                            className="text-[clamp(22px,3vw,32px)] font-bold leading-tight m-0"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                        >
                            Адміністратори
                        </h1>
                        <p className="text-[14px] mt-1 m-0" style={{ color: 'var(--text-secondary)' }}>
                            Керування доступом до адмін-панелі
                        </p>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 shrink-0"
                        style={{ background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)' }}
                    >
                        <Plus size={15} />
                        Запросити адміна
                    </button>
                </div>
            </div>

            {/* ══ ADMINS TABLE ══ */}
            <div className="mb-8">
                {/* Table header */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                            <Users size={13} color="#8b5cf6" />
                        </div>
                        <span className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                            Адміністратори
                        </span>
                        <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}
                        >
                            {admins.length}
                        </span>
                    </div>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
                >
                    {/* Column headers */}
                    <div
                        className="grid px-5 py-2.5"
                        style={{
                            gridTemplateColumns: '2fr 1fr 1fr 40px',
                            borderBottom: '1px solid var(--admin-table-border)',
                            background: 'var(--admin-stat-bg)',
                        }}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Адміністратор</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Остання активність</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Доданий</span>
                        <span />
                    </div>

                    {admins.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12">
                            <Ghost size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                            <p className="text-[13px] m-0" style={{ color: 'var(--text-muted)' }}>Ой, тут пусто)</p>
                        </div>
                    ) : admins.map((admin, i) => (
                        <div
                            key={admin.id}
                            className="grid items-center px-5 py-3.5 transition-colors"
                            style={{
                                gridTemplateColumns: '2fr 1fr 1fr 40px',
                                borderTop: i > 0 ? '1px solid var(--admin-table-border)' : undefined,
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            {/* Адміністратор */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="relative shrink-0">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold"
                                        style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
                                    >
                                        {(admin.name ?? admin.email)[0].toUpperCase()}
                                    </div>
                                    {isOnline(admin.lastSeenAt) && (
                                        <span
                                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                                            style={{ background: '#10b981', borderColor: 'var(--admin-table-bg)' }}
                                        />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13.5px] font-semibold m-0 truncate" style={{ color: 'var(--text-primary)' }}>
                                        {admin.name ?? '—'}
                                    </p>
                                    <p className="text-[12px] m-0 truncate" style={{ color: 'var(--text-muted)' }}>
                                        {admin.email}
                                    </p>
                                </div>
                            </div>

                            {/* Остання активність */}
                            <div className="flex items-center gap-1.5">
                                <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                                <span
                                    className="text-[12.5px]"
                                    style={{ color: isOnline(admin.lastSeenAt) ? '#10b981' : 'var(--text-muted)' }}
                                >
                                    {formatLastSeen(admin.lastSeenAt)}
                                </span>
                            </div>

                            {/* Доданий */}
                            <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                                {new Date(admin.createdAt).toLocaleDateString('uk-UA')}
                            </span>

                            {/* Дії */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setDeleteId(admin.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--admin-danger-text)'
                                    }}
                                    onMouseLeave={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                                    }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ INVITES TABLE ══ */}
            <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                        <Mail size={13} color="#f59e0b" />
                    </div>
                    <span className="font-semibold text-[14px]" style={{ color: 'var(--text-primary)' }}>
                        Очікують реєстрації
                    </span>
                    <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                    >
                        {invites.length}
                    </span>
                </div>

                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
                >
                    {/* Column headers */}
                    <div
                        className="grid px-5 py-2.5"
                        style={{
                            gridTemplateColumns: '2fr 1fr 1fr 40px',
                            borderBottom: '1px solid var(--admin-table-border)',
                            background: 'var(--admin-stat-bg)',
                        }}
                    >
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Статус</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Діє до</span>
                        <span />
                    </div>

                    {invites.length === 0 ? (
                        <Empty/>
                    ) : invites.map((invite, i) => (
                        <div
                            key={invite.id}
                            className="grid items-center px-5 py-3.5 transition-colors"
                            style={{
                                gridTemplateColumns: '2fr 1fr 1fr 40px',
                                borderTop: i > 0 ? '1px solid var(--admin-table-border)' : undefined,
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            {/* Email */}
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold"
                                    style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}
                                >
                                    {invite.email[0].toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[13.5px] font-semibold m-0 truncate" style={{ color: 'var(--text-primary)' }}>
                                        {invite.email}
                                    </p>
                                    <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>
                                        Запрошення відправлено
                                    </p>
                                </div>
                            </div>

                            {/* Статус */}
                            <div>
                                {invite.used ? (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                                        style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                                    >
                                        <CheckCircle2 size={12} /> Прийнято
                                    </span>
                                ) : (
                                    <span
                                        className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-lg"
                                        style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}
                                    >
                                        <Clock size={12} /> Очікує
                                    </span>
                                )}
                            </div>

                            {/* Діє до */}
                            <span className="text-[12.5px]" style={{ color: 'var(--text-muted)' }}>
                                {invite.expires}
                            </span>

                            {/* Дії */}
                            <div className="flex items-center justify-end gap-1">
                                {!invite.used && (
                                    <button
                                        onClick={() => copyLink(invite.link, invite.id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                                        style={{ color: copied === invite.id ? '#10b981' : 'var(--text-muted)' }}
                                        title="Копіювати посилання"
                                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-stat-bg)'}
                                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                                    >
                                        {copied === invite.id ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                )}
                                <button
                                    onClick={() => handleRevokeInvite(invite.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--admin-danger-text)'
                                    }}
                                    onMouseLeave={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                                    }}
                                >
                                    <XCircle size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ INVITE MODAL ══ */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
                >
                    <div
                        className="w-full max-w-[440px] rounded-2xl p-6"
                        style={{ background: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-stat-border)' }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-[17px] font-bold m-0" style={{ color: 'var(--text-primary)' }}>
                                    Запросити адміністратора
                                </h2>
                                <p className="text-[13px] mt-1 m-0" style={{ color: 'var(--text-muted)' }}>
                                    На пошту прийде посилання для реєстрації
                                </p>
                            </div>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {newInvite ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'var(--admin-success-bg)' }}>
                                    <CheckCircle2 size={16} color="var(--admin-success-text)" />
                                    <p className="text-[13px] font-semibold m-0" style={{ color: 'var(--admin-success-text)' }}>
                                        Запрошення надіслано на {newInvite.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold mb-2 m-0" style={{ color: 'var(--text-muted)' }}>
                                        Або скопіюй посилання вручну:
                                    </p>
                                    <div
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                                        style={{ background: 'var(--admin-page-bg)', border: '1px solid var(--admin-stat-border)' }}
                                    >
                                        <p className="text-[12px] flex-1 truncate m-0" style={{ color: 'var(--text-secondary)' }}>
                                            {newInvite.link}
                                        </p>
                                        <button
                                            onClick={() => copyLink(newInvite.link, newInvite.id)}
                                            className="flex items-center gap-1 text-[12px] font-semibold shrink-0"
                                            style={{ color: copied === newInvite.id ? 'var(--admin-success-text)' : 'var(--text-accent)' }}
                                        >
                                            {copied === newInvite.id ? <><Check size={12} /> Скопійовано</> : <><Copy size={12} /> Копіювати</>}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold"
                                    style={{ background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)' }}
                                >
                                    Закрити
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInvite} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                        Email нового адміністратора
                                    </label>
                                    <input
                                        type="email"
                                        value={inviteEmail}
                                        onChange={e => setInviteEmail(e.target.value)}
                                        placeholder="email@cityche.ua"
                                        required
                                        autoFocus
                                        className="w-full px-4 py-3 rounded-xl text-[13px] outline-none transition-all duration-150"
                                        style={{
                                            background: 'var(--admin-page-bg)',
                                            border:     '1px solid var(--admin-stat-border)',
                                            color:      'var(--text-primary)',
                                        }}
                                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                                        onBlur={e  => (e.currentTarget.style.borderColor = 'var(--admin-stat-border)')}
                                    />
                                </div>
                                {inviteError && (
                                    <div
                                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-[13px]"
                                        style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger-text)' }}
                                    >
                                        <AlertCircle size={14} />
                                        {inviteError}
                                    </div>
                                )}
                                <div className="flex gap-3 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setModalOpen(false)}
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                                        style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-secondary)' }}
                                    >
                                        Скасувати
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviteLoading || !inviteEmail}
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ background: 'var(--admin-nav-active-bg)', color: 'var(--admin-nav-active-text)' }}
                                    >
                                        {inviteLoading ? 'Надсилаємо...' : 'Надіслати запрошення'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ══ DELETE CONFIRM MODAL ══ */}
            {deleteId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}
                >
                    <div
                        className="w-full max-w-[380px] rounded-2xl p-6"
                        style={{ background: 'var(--admin-sidebar-bg)', border: '1px solid var(--admin-stat-border)' }}
                    >
                        <div className="flex flex-col items-center text-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--admin-danger-bg)' }}>
                                <Trash2 size={20} color="var(--admin-danger-text)" />
                            </div>
                            <h2 className="text-[16px] font-bold m-0" style={{ color: 'var(--text-primary)' }}>
                                Видалити адміністратора?
                            </h2>
                            <p className="text-[13px] m-0" style={{ color: 'var(--text-muted)' }}>
                                Адмін втратить доступ до панелі. Цю дію не можна відмінити.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold"
                                style={{ background: 'var(--admin-stat-bg)', border: '1px solid var(--admin-stat-border)', color: 'var(--text-secondary)' }}
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDeleteAdmin}
                                disabled={deleteLoading}
                                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-50"
                                style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger-text)', border: '1px solid var(--admin-danger-text)' }}
                            >
                                {deleteLoading ? 'Видаляємо...' : 'Так, видалити'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}