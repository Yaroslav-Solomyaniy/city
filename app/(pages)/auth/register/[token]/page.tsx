// app/auth/register/[token]/page.tsx

'use client'

import {useState, useEffect, FormEvent, ChangeEvent} from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

type Status = 'loading' | 'valid' | 'invalid' | 'used' | 'expired'

export default function RegisterPage() {
    const router          = useRouter()
    const { token }       = useParams<{ token: string }>()

    const [status,       setStatus]       = useState<Status>('loading')
    const [email,        setEmail]        = useState('')
    const [name,         setName]         = useState('')
    const [password,     setPassword]     = useState('')
    const [confirm,      setConfirm]      = useState('')
    const [showPass,     setShowPass]     = useState(false)
    const [showConfirm,  setShowConfirm]  = useState(false)
    const [submitting,   setSubmitting]   = useState(false)
    const [error,        setError]        = useState('')

    // Валідація токена при завантаженні
    useEffect(() => {
        if (!token) return

        fetch(`/api/admin/invite/verify?token=${token}`)
            .then(res => res.json())
            .then(data => {
                if (data.valid) {
                    setEmail(data.email)
                    setStatus('valid')
                } else {
                    setStatus(data.reason ?? 'invalid')
                }
            })
            .catch(() => setStatus('invalid'))
    }, [token])

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')

        if (password !== confirm) {
            setError('Паролі не співпадають')
            return
        }

        if (password.length < 8) {
            setError('Пароль має бути не менше 8 символів')
            return
        }

        setSubmitting(true)

        try {
            const res = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, name: name.trim(), password }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error ?? 'Щось пішло не так')
                return
            }

            router.push('/auth/sign-in?registered=1')
        } catch {
            setError('Помилка мережі. Спробуй ще раз.')
        } finally {
            setSubmitting(false)
        }
    }

    /* ── States ── */
    if (status === 'loading') {
        return (
            <PageShell>
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                         style={{ borderColor: 'var(--text-accent)', borderTopColor: 'transparent' }} />
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Перевіряємо посилання...</p>
                </div>
            </PageShell>
        )
    }

    if (status === 'used') {
        return (
            <PageShell>
                <StatusCard
                    icon="✓"
                    iconBg="var(--admin-success-bg)"
                    title="Посилання вже використане"
                    description="Реєстрація за цим запрошенням вже відбулась. Увійди за своїми даними."
                    action={{ label: 'Перейти до входу', href: '/auth/sign-in' }}
                />
            </PageShell>
        )
    }

    if (status === 'expired') {
        return (
            <PageShell>
                <StatusCard
                    icon="⏱"
                    iconBg="var(--admin-warning-bg)"
                    title="Посилання застаріло"
                    description="Термін дії запрошення минув. Попроси адміністратора надіслати нове."
                    action={null}
                />
            </PageShell>
        )
    }

    if (status === 'invalid') {
        return (
            <PageShell>
                <StatusCard
                    icon="✕"
                    iconBg="var(--admin-danger-bg)"
                    title="Недійсне посилання"
                    description="Це запрошення не існує або було скасоване."
                    action={null}
                />
            </PageShell>
        )
    }

    /* ── Registration form ── */
    return (
        <PageShell>
            <div className="w-full max-w-100">

                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'var(--admin-nav-active-bg)' }}
                    >
                        <Image src="/gerb.png" width={32} height={32} alt="Герб" />
                    </div>
                    <h1
                        className="text-2xl font-bold mb-1"
                        style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
                    >
                        Реєстрація
                    </h1>
                    <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                        Тебе запросили до адмін-панелі СітіЧЕ
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{
                        background: 'var(--admin-stat-bg)',
                        border: '1px solid var(--admin-stat-border)',
                    }}
                >
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email (readonly) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                readOnly
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                                style={{
                                    background: 'var(--admin-page-bg)',
                                    border: '1px solid var(--admin-stat-border)',
                                    color: 'var(--text-muted)',
                                    cursor: 'default',
                                }}
                            />
                        </div>

                        {/* Name */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Ім&apos;я та прізвище
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Іван Петренко"
                                required
                                autoFocus
                                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-150"
                                style={{
                                    background: 'var(--admin-page-bg)',
                                    border: '1px solid var(--admin-stat-border)',
                                    color: 'var(--text-primary)',
                                }}
                                onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                                onBlur={e  => (e.currentTarget.style.borderColor = 'var(--admin-stat-border)')}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="password" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Мінімум 8 символів"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                                    style={{
                                        background: 'var(--admin-page-bg)',
                                        border: '1px solid var(--admin-stat-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                                    onBlur={e  => (e.currentTarget.style.borderColor = 'var(--admin-stat-border)')}
                                />
                                <EyeToggle show={showPass} onToggle={() => setShowPass(v => !v)} />
                            </div>

                            {/* Password strength */}
                            {password.length > 0 && (
                                <PasswordStrength password={password} />
                            )}
                        </div>

                        {/* Confirm password */}
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="confirm" className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                                Повтори пароль
                            </label>
                            <div className="relative">
                                <input
                                    id="confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    value={confirm}
                                    onChange={e => setConfirm(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                                    style={{
                                        background: 'var(--admin-page-bg)',
                                        border: `1px solid ${confirm && confirm !== password ? 'var(--admin-danger-text)' : 'var(--admin-stat-border)'}`,
                                        color: 'var(--text-primary)',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                                    onBlur={e  => (e.currentTarget.style.borderColor = confirm && confirm !== password ? 'var(--admin-danger-text)' : 'var(--admin-stat-border)')}
                                />
                                <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                                style={{ background: 'var(--admin-danger-bg)', color: 'var(--admin-danger-text)' }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting || !name || !password || !confirm}
                            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                            style={{
                                background: 'var(--admin-nav-active-bg)',
                                color: 'var(--admin-nav-active-text)',
                            }}
                        >
                            {submitting ? 'Реєструємо...' : 'Створити акаунт'}
                        </button>
                    </form>
                </div>
            </div>
        </PageShell>
    )
}

/* ─── Sub-components ─────────────────────────────────────────── */

function PageShell({ children }: { children: React.ReactNode }) {
    return (
        <main
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'var(--bg-primary)' }}
        >
            {children}
        </main>
    )
}

function StatusCard({
                        icon, iconBg, title, description, action,
                    }: {
    icon: string
    iconBg: string
    title: string
    description: string
    action: { label: string; href: string } | null
}) {
    return (
        <div className="flex flex-col items-center text-center max-w-85 gap-4">
            <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: iconBg }}
            >
                {icon}
            </div>
            <div>
                <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    {title}
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {description}
                </p>
            </div>
            {action && (
                <a
                    href={action.href}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 no-underline"
                    style={{
                        background: 'var(--admin-nav-active-bg)',
                        color: 'var(--admin-nav-active-text)',
                    }}
                >
                    {action.label}
                </a>
            )}
        </div>
    )
}

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
    return (
        <button
            type="button"
            onClick={onToggle}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
        >
            {show ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
        </button>
    )
}

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ]
    const score = checks.filter(Boolean).length

    const label = score <= 1 ? 'Слабкий' : score === 2 ? 'Середній' : score === 3 ? 'Хороший' : 'Надійний'
    const color = score <= 1 ? 'var(--admin-danger-text)' : score === 2 ? 'var(--admin-warning-text)' : score === 3 ? 'var(--text-accent)' : 'var(--admin-success-text)'

    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= score ? color : 'var(--border)' }}
                    />
                ))}
            </div>
            <p className="text-[11px] font-semibold" style={{ color }}>
                {label}
            </p>
        </div>
    )
}