'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '@/app/context/theme-context'


export default function Hero() {
    const { isDark, toggleTheme, mounted } = useTheme()
    const dark = !mounted || isDark

    return (
        <header className="relative min-h-screen flex flex-col overflow-hidden">

            {/* ── Фото — одне для обох тем ── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/panorama.jpg"
                    alt="Панорама міста"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 640px) 640px, (max-width: 1280px) 1280px, 1920px"
                    quality={90}
                />

                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(180deg, rgba(4,8,20,0.45) 0%, rgba(4,8,20,0.15) 45%, rgba(4,8,20,0.65) 100%)'
                }}/>
            </div>

            {/* ── СітіЧЕ поверх фото ── */}
            <div
                className="absolute top-24 left-0 right-0 z-10 flex flex-col items-center pointer-events-none select-none"
                style={{ animation: 'fadeUp .7s ease-out forwards' }}
            >
                <span
                    className="font-black leading-none tracking-tight"
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(64px, 12vw, 160px)',
                        color: 'rgba(255,255,255,0.92)',
                        textShadow: '0 2px 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.3)',
                    }}
                >
                    СітіЧЕ
                </span>
                <span
                    className="text-[13px] font-semibold tracking-[0.35em] uppercase mt-1"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    Громадський портал Черкас
                </span>
            </div>

            {/* ── Картка контенту ── */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16 pt-56">
                <div
                    className="max-w-4xl w-full text-center rounded-3xl p-8 md:p-12"
                    style={{
                        background: dark
                            ? 'rgba(8,16,42,0.62)'
                            : 'rgba(255,255,255,0.82)',
                        backdropFilter: 'blur(14px) saturate(1.4)',
                        WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)'}`,
                        boxShadow: dark
                            ? '0 20px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
                            : '0 20px 80px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)',
                        animation: 'fadeUp .9s ease-out .15s forwards',
                        opacity: 0,
                    }}
                >
                    {/* Бейдж */}
                    <div className="flex items-center justify-center mb-5">
                        <span
                            className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                            style={dark
                                ? { background: 'rgba(59,130,246,0.18)', border: '1px solid rgba(96,165,250,0.3)', color: '#93c5fd' }
                                : { background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', color: '#1d4ed8' }
                            }
                        >
                            Офіційний портал
                        </span>
                    </div>

                    {/* Заголовок */}
                    <h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 leading-tight"
                        style={{
                            fontFamily: 'var(--font-display)',
                            color: dark ? '#f1f5f9' : '#0f172a',
                        }}
                    >
                        Зручний пошук сервісів{' '}
                        <span style={{ color: dark ? '#60a5fa' : '#2563eb' }}>
                        для кожного мешканця
                        </span>
                    </h1>

                    {/* Опис */}
                    <p className="text-base md:text-lg mb-2 leading-relaxed"
                       style={{ color: dark ? '#cbd5e1' : '#374151' }}>
                        СітіЧЕ — єдине вікно для взаємодії з Черкасами.
                    </p>
                    <p className="text-sm mb-8"
                       style={{ color: dark ? '#94a3b8' : '#6b7280' }}>
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
                        <Link
                            href="/about"
                            className="px-8 py-3.5 rounded-full font-semibold transition-all duration-200 hover:scale-105"
                            style={dark
                                ? { background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }
                                : { background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.3)', color: '#1d4ed8' }
                            }
                        >
                            Про розробників
                        </Link>
                    </div>

                    {/* Статистика */}
                    <div
                        className="mt-8 pt-7 grid grid-cols-1 sm:grid-cols-3 gap-5"
                        style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}` }}
                    >
                        {[
                            { value: 'Усі послуги громади',  label: 'Адміністративні, соціальні та довідкові сервіси онлайн' },
                            { value: 'Доступно 24/7',        label: 'Користуйтеся порталом у будь-який час' },
                            { value: 'Актуальна інформація', label: 'Оновлені ресурси та перевірені дані' },
                        ].map(stat => (
                            <div key={stat.value} className="text-center">
                                <p className="text-[16px] font-bold mb-1"
                                   style={{ fontFamily: 'var(--font-display)', color: dark ? '#f1f5f9' : '#0f172a' }}>
                                    {stat.value}
                                </p>
                                <p className="text-[12px] leading-snug"
                                   style={{ color: dark ? '#64748b' : '#9ca3af' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    )
}