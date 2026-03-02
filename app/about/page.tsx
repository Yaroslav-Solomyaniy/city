'use client'

import React, { useState } from 'react'

type FormTab = 'feedback' | 'add-resource' | 'remove-resource' | 'add-category'

const CATEGORIES = [
    "Здоров'я", 'Освіта', 'Міська рада', 'Соціальні послуги',
    'Комунальні послуги', 'Бізнес', 'Транспорт', 'Екстрені служби',
    'Онлайн запис', 'Школи', 'Дитячі садки', 'Медичні заклади',
]

const TABS: { id: FormTab; label: string; icon: string }[] = [
    { id: 'feedback',        label: 'Зворотній зв\'язок', icon: '💬' },
    { id: 'add-resource',    label: 'Додати ресурс',      icon: '➕' },
    { id: 'remove-resource', label: 'Видалити ресурс',    icon: '🗑️' },
    { id: 'add-category',    label: 'Нова категорія',     icon: '📂' },
]

/* ── shared input/label style refs ── */
const inputCls = 'w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition'
const inputSt  = { background: 'var(--about-input-bg)', border: '1px solid var(--about-input-border)', color: 'var(--about-input-text)' } as React.CSSProperties
const labelCls = 'block text-xs font-semibold uppercase tracking-wider mb-1.5'

function FeedbackForm() {
    const [sent, setSent] = useState(false)
    if (sent) return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-3">✅</div>
            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--about-text)' }}>Дякуємо!</p>
            <p className="text-sm" style={{ color: 'var(--about-muted)' }}>Ваше повідомлення надіслано. Ми розглянемо його найближчим часом.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Надіслати ще одне</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls} style={{ color: 'var(--about-label)' }}>Ім&#39;я</label>
                    <input required placeholder="Іван Петренко" className={inputCls} style={inputSt}/>
                </div>
                <div>
                    <label className={labelCls} style={{ color: 'var(--about-label)' }}>Email</label>
                    <input required type="email" placeholder="email@example.com" className={inputCls} style={inputSt}/>
                </div>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Тема</label>
                <input required placeholder="Коротко опишіть тему" className={inputCls} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Повідомлення</label>
                <textarea required rows={4} placeholder="Ваше повідомлення..." className={`${inputCls} resize-none`} style={inputSt}/>
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
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
            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--about-text)' }}>Заявку надіслано!</p>
            <p className="text-sm" style={{ color: 'var(--about-muted)' }}>Ми перевіримо ресурс та додамо його на портал.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Запропонувати ще один</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelCls} style={{ color: 'var(--about-label)' }}>Назва ресурсу</label>
                    <input required placeholder="Наприклад: Черкаський зоопарк" className={inputCls} style={inputSt}/>
                </div>
                <div>
                    <label className={labelCls} style={{ color: 'var(--about-label)' }}>Посилання (URL)</label>
                    <input required type="url" placeholder="https://example.com" className={inputCls} style={inputSt}/>
                </div>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Категорія</label>
                <select required className={`${inputCls} appearance-none cursor-pointer`} style={inputSt}>
                    <option value="" style={{ background: 'var(--about-select-option-bg)' }}>Оберіть категорію</option>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ background: 'var(--about-select-option-bg)' }}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Короткий опис</label>
                <textarea required rows={3} placeholder="Що саме можна знайти на цьому ресурсі?" className={`${inputCls} resize-none`} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Ваш email (необов&#39;язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className={inputCls} style={inputSt}/>
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
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
            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--about-text)' }}>Заявку отримано!</p>
            <p className="text-sm" style={{ color: 'var(--about-muted)' }}>Ми перевіримо інформацію та розглянемо запит на видалення.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Надіслати ще один</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div className="p-3.5 rounded-xl flex items-start gap-3"
                 style={{ background: 'var(--about-warn-bg)', border: '1px solid var(--about-warn-border)' }}>
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm m-0 leading-relaxed" style={{ color: 'var(--about-warn-text)' }}>
                    Вкажіть ресурс, який потрібно видалити з порталу. Ми перевіримо обґрунтованість запиту.
                </p>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Назва або URL ресурсу</label>
                <input required placeholder="Наприклад: https://example.com або 'Назва ресурсу'" className={inputCls} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Причина видалення</label>
                <select required className={`${inputCls} appearance-none cursor-pointer`} style={inputSt}>
                    <option value="" style={{ background: 'var(--about-select-option-bg)' }}>Оберіть причину</option>
                    {['Посилання застаріло або не працює', 'Невірна інформація', 'Дублікат іншого ресурсу', 'Не відповідає тематиці порталу', 'Інше'].map(o =>
                        <option key={o} value={o} style={{ background: 'var(--about-select-option-bg)' }}>{o}</option>
                    )}
                </select>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Коментар</label>
                <textarea rows={3} placeholder="Додаткові деталі (необов'язково)" className={`${inputCls} resize-none`} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Ваш email (необов&#39;язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className={inputCls} style={inputSt}/>
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
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
            <p className="font-semibold text-lg mb-1" style={{ color: 'var(--about-text)' }}>Пропозицію надіслано!</p>
            <p className="text-sm" style={{ color: 'var(--about-muted)' }}>Ми розглянемо доцільність додавання нової категорії.</p>
            <button onClick={() => setSent(false)} className="mt-5 text-sm text-blue-400 hover:underline">Запропонувати ще одну</button>
        </div>
    )
    return (
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="flex flex-col gap-4">
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Назва категорії</label>
                <input required placeholder="Наприклад: Культура та дозвілля" className={inputCls} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Опис категорії</label>
                <textarea required rows={3} placeholder="Що буде включати ця категорія?" className={`${inputCls} resize-none`} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Приклади ресурсів</label>
                <textarea rows={3} placeholder="Перелічіть кілька ресурсів" className={`${inputCls} resize-none`} style={inputSt}/>
            </div>
            <div>
                <label className={labelCls} style={{ color: 'var(--about-label)' }}>Ваш email (необов&#39;язково)</label>
                <input type="email" placeholder="Для зворотного зв'язку" className={inputCls} style={inputSt}/>
            </div>
            <button type="submit" className="self-start px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                Запропонувати категорію
            </button>
        </form>
    )
}

export default function AboutPage() {
    const [activeTab, setActiveTab] = useState<FormTab>('feedback')

    return (
        <section
            className="min-h-screen py-40 px-4 relative"
            style={{ background: 'var(--about-bg)' }}
        >
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[300px] pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.08) 0%, transparent 70%)' }}/>

            <div className="max-w-6xl mx-auto relative z-10 flex flex-col gap-24">

                {/* ── About ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4 px-3 py-1 rounded-full"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            Про портал
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--about-text)' }}>
                            Громадський портал
                            <br/>
                            <span style={{ color: '#60a5fa' }}>Черкащини</span>
                        </h2>
                        <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--about-desc)' }}>
                            Портал створено з метою забезпечення відкритого та зручного доступу мешканців до муніципальних послуг, актуальної інформації та ресурсів міської громади.
                        </p>
                        <p className="leading-relaxed" style={{ color: 'var(--about-muted)' }}>
                            Наша місія — цифровізувати взаємодію між мешканцями та місцевими органами влади, зробивши кожну послугу доступною в кілька кліків.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: '👨‍💻', title: 'Розробник порталу',             value: "Солом'яний Ярослав Сергійович",                              detail: 'Розробка та технічна реалізація порталу'              },
                            { icon: '💡', title: 'Автор ідеї',             value: 'Холупняк Катерина Олександрівна',                                detail: 'Концепція та стратегія розвитку'                     },
                            { icon: '✍️', title: 'Наповнення порталу',     value: 'Ткаченко Дмитро Олександрович, Самойленко Олександр Олександрович',            detail: 'Контент, категорії та ресурси'                       },
                            { icon: '🏢', title: 'Адміністрування порталу', value: 'КП «Інститут розвитку міста та цифрової трансформації» ЧМР', detail: 'Відповідає за наповнення, актуальність та підтримку' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-4 p-5 rounded-2xl transition-all duration-200"
                                 style={{ background: 'var(--about-card-bg)', border: '1px solid var(--about-card-border)' }}
                                 onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--about-card-hover)'}
                                 onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--about-card-bg)'}
                            >
                                <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                                <div>
                                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">{item.title}</p>
                                    <p className="font-semibold mb-0.5" style={{ color: 'var(--about-text)' }}>{item.value}</p>
                                    <p className="text-sm" style={{ color: 'var(--about-muted)' }}>{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Contact ── */}
                <div>
                    <div className="mb-8">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-400 mb-4 px-3 py-1 rounded-full"
                              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
                            Зворотній зв&#39;язок
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold leading-tight"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--about-text)' }}>
                            Допоможіть зробити портал кращим
                        </h3>
                        <p className="mt-3 max-w-xl" style={{ color: 'var(--about-muted)' }}>
                            Напишіть нам, запропонуйте новий ресурс або категорію, повідомте про застарілу інформацію.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-150"
                                    style={activeTab === tab.id
                                        ? { background: 'var(--about-tab-active-bg)', border: '1px solid var(--about-tab-active-border)', color: 'var(--about-text)' }
                                        : { background: 'var(--about-tab-inactive-bg)', border: '1px solid var(--about-tab-inactive-border)', color: 'var(--about-muted)' }
                                    }
                                >
                                    <span className="text-lg shrink-0">{tab.icon}</span>
                                    <span className="text-sm font-medium leading-snug">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="rounded-2xl p-6 md:p-8"
                             style={{ background: 'var(--about-form-bg)', border: '1px solid var(--about-form-border)' }}>
                            {activeTab === 'feedback'        && <FeedbackForm/>}
                            {activeTab === 'add-resource'    && <AddResourceForm/>}
                            {activeTab === 'remove-resource' && <RemoveResourceForm/>}
                            {activeTab === 'add-category'    && <AddCategoryForm/>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}