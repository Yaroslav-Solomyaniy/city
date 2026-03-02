'use client'
import {ChangeEvent, useState} from 'react'
import {signIn} from 'next-auth/react'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: ChangeEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const res = await signIn('nodemailer', {email, redirect: false})

        setLoading(false)

        if (res?.error) {
            setError('Щось пішло не так. Спробуй ще раз.')
            return
        }

        setSent(true)
    }

    if (sent) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="text-5xl mb-6">📬</div>
                    <h1 className="text-2xl font-bold mb-3">Перевір пошту</h1>
                    <p className="text-gray-400 mb-2">Ми надіслали посилання на</p>
                    <p className="font-semibold text-blue-400 mb-6">{email}</p>
                    <p className="text-sm text-gray-500">
                        Посилання діє 24 години. Якщо лист не прийшов — перевір «Спам».
                    </p>
                    <button
                        onClick={() => {
                            setSent(false);
                            setEmail('')
                        }}
                        className="mt-8 text-sm text-gray-400 hover:text-white underline transition"
                    >
                        Ввести інший email
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Вхід до CityChe</h1>
                    <p className="text-gray-400 text-sm">
                        Введи свій email — ми надішлемо посилання для входу
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Надсилаємо...' : 'Надіслати посилання →'}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-gray-500">
                    Немає акаунту? Просто введи email — ми створимо його автоматично.
                </p>
            </div>
        </main>
    )
}
