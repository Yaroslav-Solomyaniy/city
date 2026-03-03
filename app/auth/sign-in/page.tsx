// app/auth/sign-in/page.tsx

'use client'

import { useState, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignInPage() {
    const router = useRouter()
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')
    const [showPass, setShowPass] = useState(false)

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const res = await signIn('credentials', {
            email,
            password,
            redirect: false,
        })

        setLoading(false)

        if (!res || res.error || !res.ok) {
            setError('Невірний email або пароль')
            return
        }

        router.push('/admin')
        router.refresh()
    }

    return (
        <main
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: 'var(--bg-primary)' }}
        >
            <div className="w-full max-w-[400px]">

                {/* Logo */}
                <div className="flex flex-col items-center mb-10">
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
                        СітіЧЕ
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Вхід до адміністративної панелі
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

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="text-sm font-semibold"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@cityche.ua"
                                required
                                autoComplete="email"
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
                            <label
                                htmlFor="password"
                                className="text-sm font-semibold"
                                style={{ color: 'var(--text-secondary)' }}
                            >
                                Пароль
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all duration-150"
                                    style={{
                                        background: 'var(--admin-page-bg)',
                                        border: '1px solid var(--admin-stat-border)',
                                        color: 'var(--text-primary)',
                                    }}
                                    onFocus={e => (e.currentTarget.style.borderColor = 'var(--text-accent)')}
                                    onBlur={e  => (e.currentTarget.style.borderColor = 'var(--admin-stat-border)')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(v => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                                    style={{ color: 'var(--text-muted)' }}
                                    tabIndex={-1}
                                >
                                    {showPass ? (
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
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                                style={{
                                    background: 'var(--admin-danger-bg)',
                                    color: 'var(--admin-danger-text)',
                                }}
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
                            disabled={loading || !email || !password}
                            className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                            style={{
                                background: 'var(--admin-nav-active-bg)',
                                color: 'var(--admin-nav-active-text)',
                            }}
                        >
                            {loading ? 'Вхід...' : 'Увійти'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    )
}