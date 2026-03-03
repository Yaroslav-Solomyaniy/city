// app/admin/administrators/page.tsx

'use client'

import React, { useState } from 'react'
import {
    Users, Plus, Mail, Trash2, Clock,
    CheckCircle2, XCircle, Copy, Check,
    X, AlertCircle,
} from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────────── */
interface Admin {
    id:        string
    name:      string | null
    email:     string
    createdAt: string
    lastSeen:  string | null
}

interface Invite {
    id:        string
    email:     string
    used:      boolean
    expires:   string
    createdAt: string
    link:      string
}

/* ─── Mock data ──────────────────────────────────────────────── */
const MOCK_ADMINS: Admin[] = [
    { id: '1', name: 'Ярослав С.',  email: 'yaroslav@cityche.ua', createdAt: '01.01.2026', lastSeen: '3 хв тому' },
    { id: '2', name: 'Катерина Х.', email: 'kate@cityche.ua',     createdAt: '15.01.2026', lastSeen: '2 год тому' },
    { id: '3', name: 'Дмитро Т.',   email: 'dmytro@cityche.ua',   createdAt: '20.02.2026', lastSeen: 'Вчора' },
]

const MOCK_INVITES: Invite[] = [
    {
        id: '1',
        email:     'oleksandr@cityche.ua',
        used:      false,
        expires:   '05.03.2026',
        createdAt: '03.03.2026',
        link:      'https://cityche.ua/auth/register/abc123',
    },
]

/* ─── Page ───────────────────────────────────────────────────── */
export default function AdministratorsPage() {
    const [admins]  = useState<Admin[]>(MOCK_ADMINS)
    const [invites, setInvites] = useState<Invite[]>(MOCK_INVITES)

    // Invite modal
    const [modalOpen,    setModalOpen]    = useState(false)
    const [inviteEmail,  setInviteEmail]  = useState('')
    const [inviteLoading,setInviteLoading]= useState(false)
    const [inviteError,  setInviteError]  = useState('')
    const [newInvite,    setNewInvite]    = useState<Invite | null>(null)

    // Delete confirm
    const [deleteId,     setDeleteId]     = useState<string | null>(null)
    const [deleteLoading,setDeleteLoading]= useState(false)

    // Copy link
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
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: inviteEmail }),
            })

            const data = await res.json()

            if (!res.ok) {
                setInviteError(data.error ?? 'Щось пішло не так')
                return
            }

            setNewInvite(data.invite)
            setInvites(prev => [data.invite, ...prev])
        } catch {
            setInviteError('Помилка мережі. Спробуй ще раз.')
        } finally {
            setInviteLoading(false)
        }
    }

    async function handleRevokeInvite(id: string) {
        setInvites(prev => prev.filter(i => i.id !== id))
    }

    async function handleDeleteAdmin() {
        if (!deleteId) return
        setDeleteLoading(true)
        // TODO: fetch DELETE /api/admin/users/[id]
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
        <div className="max-w-[900px] mx-auto">

            {/* ── Header ── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <span>Адмін-панель</span>
                    <span className="text-[10px]">›</span>
                    <span style={{ color: 'var(--text-primary)' }}>Адміністратори</span>
                </div>
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
                        style={{
                            background: 'var(--admin-nav-active-bg)',
                            color: 'var(--admin-nav-active-text)',
                        }}
                    >
                        <Plus size={15} />
                        Запросити адміна
                    </button>
                </div>
            </div>

            {/* ── Admins list ── */}
            <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
            >
                <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.12)' }}>
                        <Users size={15} color="#8b5cf6" />
                    </div>
                    <div>
                        <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                            Активні адміністратори
                        </p>
                        <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                            {admins.length} {admins.length === 1 ? 'адмін' : 'адміни'}
                        </p>
                    </div>
                </div>

                <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                    {admins.map(admin => (
                        <div
                            key={admin.id}
                            className="flex items-center gap-4 px-5 py-4 transition-colors"
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                            {/* Avatar */}
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold"
                                style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}
                            >
                                {(admin.name ?? admin.email)[0].toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[13.5px] font-semibold m-0 truncate" style={{ color: 'var(--text-primary)' }}>
                                    {admin.name ?? '—'}
                                </p>
                                <p className="text-[12px] m-0 truncate" style={{ color: 'var(--text-muted)' }}>
                                    {admin.email}
                                </p>
                            </div>

                            {/* Last seen */}
                            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                                <Clock size={11} style={{ color: 'var(--text-muted)' }} />
                                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                    {admin.lastSeen ?? 'Ніколи'}
                                </span>
                            </div>

                            {/* Added */}
                            <div className="hidden md:block shrink-0">
                                <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                                    з {admin.createdAt}
                                </span>
                            </div>

                            {/* Delete */}
                            <button
                                onClick={() => setDeleteId(admin.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 shrink-0"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'
                                    ;(e.currentTarget as HTMLElement).style.color = 'var(--admin-danger-text)'
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                                    ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                                }}
                                title="Видалити адміна"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Pending invites ── */}
            {invites.length > 0 && (
                <div
                    className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--admin-table-bg)', border: '1px solid var(--admin-table-border)' }}
                >
                    <div className="flex items-center gap-2.5 px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.12)' }}>
                            <Mail size={15} color="#f59e0b" />
                        </div>
                        <div>
                            <p className="font-semibold text-[14px] m-0" style={{ color: 'var(--text-primary)' }}>
                                Очікують реєстрації
                            </p>
                            <p className="text-[11px] m-0" style={{ color: 'var(--text-muted)' }}>
                                Запрошення відправлені, але ще не прийняті
                            </p>
                        </div>
                    </div>

                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                        {invites.map(invite => (
                            <div
                                key={invite.id}
                                className="flex items-center gap-4 px-5 py-4 transition-colors"
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-table-row-hover)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                            >
                                {/* Status icon */}
                                <div className="shrink-0">
                                    {invite.used
                                        ? <CheckCircle2 size={18} color="#10b981" />
                                        : <Clock size={18} color="#f59e0b" />
                                    }
                                </div>

                                {/* Email */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13.5px] font-semibold m-0 truncate" style={{ color: 'var(--text-primary)' }}>
                                        {invite.email}
                                    </p>
                                    <p className="text-[12px] m-0" style={{ color: 'var(--text-muted)' }}>
                                        Діє до {invite.expires}
                                    </p>
                                </div>

                                {/* Copy link */}
                                {!invite.used && (
                                    <button
                                        onClick={() => copyLink(invite.link, invite.id)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all duration-150 shrink-0"
                                        style={{
                                            background: copied === invite.id ? 'var(--admin-success-bg)' : 'var(--admin-stat-bg)',
                                            color:      copied === invite.id ? 'var(--admin-success-text)' : 'var(--text-secondary)',
                                            border: '1px solid var(--admin-stat-border)',
                                        }}
                                    >
                                        {copied === invite.id
                                            ? <><Check size={12} /> Скопійовано</>
                                            : <><Copy size={12} /> Копіювати посилання</>
                                        }
                                    </button>
                                )}

                                {/* Revoke */}
                                <button
                                    onClick={() => handleRevokeInvite(invite.id)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 shrink-0"
                                    style={{ color: 'var(--text-muted)' }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'var(--admin-danger-bg)'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--admin-danger-text)'
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.background = 'transparent'
                                        ;(e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                                    }}
                                    title="Скасувати запрошення"
                                >
                                    <XCircle size={15} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══ INVITE MODAL ══ */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
                >
                    <div
                        className="w-full max-w-[440px] rounded-2xl p-6"
                        style={{
                            background: 'var(--admin-sidebar-bg)',
                            border: '1px solid var(--admin-stat-border)',
                        }}
                    >
                        {/* Modal header */}
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
                                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--admin-nav-hover-bg)'}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Success state */}
                        {newInvite ? (
                            <div className="flex flex-col gap-4">
                                <div
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                    style={{ background: 'var(--admin-success-bg)' }}
                                >
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
                                        style={{
                                            background: 'var(--admin-page-bg)',
                                            border: '1px solid var(--admin-stat-border)',
                                        }}
                                    >
                                        <p className="text-[12px] flex-1 truncate m-0" style={{ color: 'var(--text-secondary)' }}>
                                            {newInvite.link}
                                        </p>
                                        <button
                                            onClick={() => copyLink(newInvite.link, newInvite.id)}
                                            className="flex items-center gap-1 text-[12px] font-semibold shrink-0 transition-colors"
                                            style={{ color: copied === newInvite.id ? 'var(--admin-success-text)' : 'var(--text-accent)' }}
                                        >
                                            {copied === newInvite.id ? <><Check size={12} /> Скопійовано</> : <><Copy size={12} /> Копіювати</>}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                                    style={{
                                        background: 'var(--admin-nav-active-bg)',
                                        color: 'var(--admin-nav-active-text)',
                                    }}
                                >
                                    Закрити
                                </button>
                            </div>
                        ) : (
                            /* Form state */
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
                                            border: '1px solid var(--admin-stat-border)',
                                            color: 'var(--text-primary)',
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
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                                        style={{
                                            background: 'var(--admin-stat-bg)',
                                            border: '1px solid var(--admin-stat-border)',
                                            color: 'var(--text-secondary)',
                                        }}
                                    >
                                        Скасувати
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={inviteLoading || !inviteEmail}
                                        className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            background: 'var(--admin-nav-active-bg)',
                                            color: 'var(--admin-nav-active-text)',
                                        }}
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
                        style={{
                            background: 'var(--admin-sidebar-bg)',
                            border: '1px solid var(--admin-stat-border)',
                        }}
                    >
                        <div className="flex flex-col items-center text-center gap-3 mb-6">
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                                style={{ background: 'var(--admin-danger-bg)' }}
                            >
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
                                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150"
                                style={{
                                    background: 'var(--admin-stat-bg)',
                                    border: '1px solid var(--admin-stat-border)',
                                    color: 'var(--text-secondary)',
                                }}
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={handleDeleteAdmin}
                                disabled={deleteLoading}
                                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 disabled:opacity-50"
                                style={{
                                    background: 'var(--admin-danger-bg)',
                                    color: 'var(--admin-danger-text)',
                                    border: '1px solid var(--admin-danger-text)',
                                }}
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