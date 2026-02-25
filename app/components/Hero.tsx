'use client'

import Image from 'next/image'
import Link from 'next/link'

interface HeroProps {
    onOpenModal: () => void
}

export default function Hero({ onOpenModal }: HeroProps) {
    return (
        <header className="relative min-h-screen flex flex-col">

            {/* ── Фонове зображення ── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=85"
                    alt="Панорама міста Черкаси"
                    fill
                    priority
                    className="object-cover"
                    sizes="100vw"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(180deg, rgba(7,13,28,0.55) 0%, rgba(7,13,28,0.3) 40%, rgba(7,13,28,0.85) 100%)',
                    }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(15,30,80,0.25)' }}
                />
            </div>

            {/* ── Контент ── */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
                <div
                    className="max-w-4xl w-full text-center rounded-3xl p-10 md:p-14"
                    style={{
                        background: 'rgba(7,20,55,0.62)',
                        backdropFilter: 'blur(20px) saturate(1.4)',
                        border: '1px solid rgba(96,165,250,0.2)',
                        boxShadow: '0 20px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
                        animation: 'fadeUp .9s ease-out forwards',
                    }}
                >
                    {/* Бейдж */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        {/* City-Che бренд бейдж */}
                        <div
                            className="h-7 px-3 rounded-lg flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                                boxShadow:  '0 2px 12px rgba(99,102,241,0.4)',
                            }}
                        >
                            <span className="text-white font-black text-[11px] tracking-widest">City-Che</span>
                        </div>
                        <span
                            className="text-xs font-semibold tracking-widest uppercase text-blue-300 px-3 py-1 rounded-full"
                            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(96,165,250,0.3)' }}
                        >
                            Офіційний портал
                        </span>
                    </div>

                    {/* Заголовок */}
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight"
                        style={{ fontFamily: 'Playfair Display, serif', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                    >
                        Зручний пошук сервісів
                        <span style={{ color: '#60a5fa' }}> для кожного мешканця</span>
                    </h1>

                    {/* Опис */}
                    <p className="text-slate-300 text-lg mb-2 leading-relaxed">
                        CityChe — єдине вікно для взаємодії з Черкасами.
                    </p>
                    <p className="text-slate-300 text-lg mb-3 leading-relaxed">
                        Отримуйте послуги та знаходьте важливі сервіси в кілька кліків.
                    </p>
                    <p className="text-slate-400 text-sm mb-10">
                        Від медицини та освіти до розкладу транспорту й державних сервісів — все зібрано тут.
                    </p>

                    {/* Кнопки */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/categories"
                            className="px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                                boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                            }}
                        >
                            Переглянути категорії
                        </Link>
                        <button
                            onClick={onOpenModal}
                            className="px-8 py-3.5 rounded-full font-semibold text-white transition-all duration-200 hover:scale-105"
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)',
                            }}
                        >
                            Про розробників
                        </button>
                    </div>

                    {/* Статистика */}
                    <div
                        className="mt-10 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        {[
                            {
                                value: 'Усі послуги громади',
                                label: 'Адміністративні, соціальні та довідкові сервіси онлайн',
                            },
                            {
                                value: 'Доступно 24/7',
                                label: 'Користуйтеся порталом у будь-який час',
                            },
                            {
                                value: 'Актуальна інформація',
                                label: 'Оновлені ресурси та перевірені дані',
                            },
                        ].map((stat) => (
                            <div key={stat.value} className="text-center">
                                <p
                                    className="text-[17px] font-bold text-white mb-1"
                                    style={{ fontFamily: 'Playfair Display, serif' }}
                                >
                                    {stat.value}
                                </p>
                                <p className="text-slate-400 text-[12px] leading-snug">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="relative z-10 flex justify-center pb-8">
                <div className="flex flex-col items-center gap-1 text-white/40 text-xs">
                    <span className="text-sm">Гортати вниз</span>
                    <svg
                        className="animate-bounce"
                        width="16" height="16" viewBox="0 0 16 16"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                    >
                        <path d="M3 6l5 5 5-5" />
                    </svg>
                </div>
            </div>
        </header>
    )
}