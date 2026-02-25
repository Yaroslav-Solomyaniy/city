'use client'

import React, { useState } from 'react'

type FormTab = 'feedback' | 'add-resource' | 'remove-resource' | 'add-category'

const CATEGORIES = [
    "Здоров'я", 'Освіта', 'Міська рада', 'Соціальні послуги',
    'Комунальні послуги', 'Бізнес', 'Транспорт', 'Екстрені служби',
    'Онлайн запис', 'Школи', 'Дитячі садки', 'Медичні заклади',
]

const TABS: { id: FormTab; label: string; icon: string }[] = [
    { id: 'feedback', label: 'Зворотній зв\'язок', icon: '💬' },
    { id: 'add-resource', label: 'Додати ресурс', icon: '➕' },
    { id: 'remove-resource', label: 'Видалити ресурс', icon: '🗑️' },
    { id: 'add-category', label: 'Нова категорія', icon: '📂' },
]

function FeedbackForm() {
    const [sent, setSent] = useState(false)
    if (sent) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-lg mb-1">Дякуємо!</p>
            <p className="text-slate-400 text-sm">Ваше повідомлення надіслано. Ми розглянемо його найближчим часом.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Надіслати ще одне</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ім'я</label>
                    <input required placeholder="Іван Петренко" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                    <input required type="email" placeholder="email@example.com" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Тема</label>
                <input required placeholder="Коротко опишіть тему" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Повідомлення</label>
                <textarea required rows={4} placeholder="Ваше повідомлення..." className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                Надіслати
            </button>
        </form>
    )
}

function AddResourceForm() {
    const [sent, setSent] = useState(false)
    if (sent) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-lg mb-1">Заявку надіслано!</p>
            <p className="text-slate-400 text-sm">Ми перевіримо ресурс та додамо його на портал.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Запропонувати ще один</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Назва ресурсу</label>
                    <input required placeholder="Наприклад: Черкаський зоопарк" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Посилання (URL)</label>
                    <input required type="url" placeholder="https://example.com" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Категорія</label>
                <select required className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="" style={{ background: '#0f172a' }}>Оберіть категорію</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: '#0f172a' }}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Короткий опис</label>
                <textarea required rows={3} placeholder="Що саме можна знайти на цьому ресурсі?" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ваш email (необов'язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                Запропонувати ресурс
            </button>
        </form>
    )
}

function RemoveResourceForm() {
    const [sent, setSent] = useState(false)
    if (sent) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-lg mb-1">Заявку отримано!</p>
            <p className="text-slate-400 text-sm">Ми перевіримо інформацію та розглянемо запит на видалення.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Надіслати ще один запит</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm text-red-300 m-0 leading-relaxed">Вкажіть ресурс, який потрібно видалити з порталу. Ми перевіримо обґрунтованість запиту перед виконанням.</p>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Назва або URL ресурсу</label>
                <input required placeholder="Наприклад: https://example.com або 'Назва ресурсу'" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Причина видалення</label>
                <select required className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition appearance-none cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="" style={{ background: '#0f172a' }}>Оберіть причину</option>
                    <option value="outdated" style={{ background: '#0f172a' }}>Посилання застаріло або не працює</option>
                    <option value="wrong" style={{ background: '#0f172a' }}>Невірна інформація</option>
                    <option value="duplicate" style={{ background: '#0f172a' }}>Дублікат іншого ресурсу</option>
                    <option value="irrelevant" style={{ background: '#0f172a' }}>Не відповідає тематиці порталу</option>
                    <option value="other" style={{ background: '#0f172a' }}>Інше</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Коментар</label>
                <textarea rows={3} placeholder="Додаткові деталі (необов'язково)" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ваш email (необов'язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                Надіслати запит
            </button>
        </form>
    )
}

function AddCategoryForm() {
    const [sent, setSent] = useState(false)
    if (sent) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-white font-semibold text-lg mb-1">Пропозицію надіслано!</p>
            <p className="text-slate-400 text-sm">Ми розглянемо доцільність додавання нової категорії.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Запропонувати ще одну</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Назва категорії</label>
                <input required placeholder="Наприклад: Культура та дозвілля" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Опис категорії</label>
                <textarea required rows={3} placeholder="Що буде включати ця категорія? Які послуги або ресурси?" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Приклади ресурсів для категорії</label>
                <textarea rows={3} placeholder="Перелічіть кілька ресурсів, які могли б увійти до цієї категорії" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Ваш email (необов'язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder:text-slate-600 outline-none focus:ring-2 focus:ring-blue-500/50 transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                Запропонувати категорію
            </button>
        </form>
    )
}

export default function PortalInfo() {
    const [activeTab, setActiveTab] = useState<FormTab>('feedback')

    return (
        <section
            className="min-h-screen py-40 px-4 relative"
            style={{ background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(10,18,38,1) 100%)' }}
        >
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }} />

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-24">

                {/* ── SECTION 1: About ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left */}
                    <div>
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4 px-3 py-1 rounded-full"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            Про портал
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            Громадський портал
                            <br />
                            <span style={{ color: '#60a5fa' }}>Черкащини</span>
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed mb-6">
                            Портал створено з метою забезпечення відкритого та зручного доступу мешканців до муніципальних послуг, актуальної інформації та ресурсів міської громади.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Наша місія — цифровізувати взаємодію між мешканцями та місцевими органами влади, зробивши кожну послугу доступною в кілька кліків.
                        </p>
                    </div>

                    {/* Right — cards */}
                    <div className="space-y-4">
                        {[
                            {
                                icon: '👨‍💻',
                                title: 'Розробник',
                                value: "Солом'яний Ярослав",
                                detail: 'Розробка та технічна реалізація порталу',
                            },
                            {
                                icon: '💡',
                                title: 'Автор ідеї',
                                value: 'Холупняк Катерина',
                                detail: 'Концепція та стратегія розвитку',
                            },
                            {
                                icon: '✍️',
                                title: 'Наповнення порталу',
                                value: 'Ткаченко Дмитро, Самойленко Олександр',
                                detail: 'Контент, категорії та ресурси',
                            },
                            {
                                icon: '🏢',
                                title: 'Адміністрування порталу',
                                value: 'КП «Інститут розвитку міста та цифрової трансформації» ЧМР',
                                detail: 'Відповідає за наповнення, актуальність та підтримку',
                            },
                        ].map((item, idx) => (
                            <div key={idx}
                                 className="flex gap-4 p-5 rounded-2xl transition-all duration-200 hover:bg-white/5"
                                 style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                            >
                                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                                <div>
                                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">{item.title}</p>
                                    <p className="text-white font-semibold mb-0.5">{item.value}</p>
                                    <p className="text-slate-500 text-sm">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── SECTION 2: Contact form ── */}
                <div>
                    {/* Section heading */}
                    <div className="mb-8">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4 px-3 py-1 rounded-full"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            Зворотній зв'язок
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight"
                            style={{ fontFamily: 'Playfair Display, serif' }}>
                            Допоможіть зробити портал кращим
                        </h3>
                        <p className="text-slate-400 mt-3 max-w-xl">
                            Напишіть нам, запропонуйте новий ресурс або категорію, повідомте про застарілу інформацію.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                        {/* Tab list — grid 2×2 on mobile, vertical list on desktop */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150 ${
                                        activeTab === tab.id
                                            ? 'text-white'
                                            : 'text-slate-400 hover:text-slate-200'
                                    }`}
                                    style={
                                        activeTab === tab.id
                                            ? { background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }
                                            : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }
                                    }
                                >
                                    <span className="text-lg shrink-0">{tab.icon}</span>
                                    <span className="text-sm font-medium leading-snug">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Form panel */}
                        <div className="rounded-2xl p-6 md:p-8"
                             style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {activeTab === 'feedback' && <FeedbackForm />}
                            {activeTab === 'add-resource' && <AddResourceForm />}
                            {activeTab === 'remove-resource' && <RemoveResourceForm />}
                            {activeTab === 'add-category' && <AddCategoryForm />}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}