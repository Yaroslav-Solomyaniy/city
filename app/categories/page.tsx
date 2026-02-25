import Link from 'next/link'
import {
    Heart, GraduationCap, Building2, Users, Zap,
    Briefcase, Bus, AlertCircle, Calendar, School,
    Baby, Hospital, Search, ArrowRight,
} from 'lucide-react'
import React from 'react'
import type { Metadata } from 'next'

interface Category {
    id: string
    title: string
    titleEn: string
    icon: React.ElementType
    photo: string
    accent: string
    bg: string
    services: string[]
    count: number
}

const categories: Category[] = [
    {
        id: 'health',
        title: "Здоров'я",
        titleEn: 'Health',
        icon: Heart,
        photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&q=75',
        accent: '#ef4444',
        bg: '#fef2f2',
        services: ['Лікарні', 'Поліклініки', 'Аптеки', 'Лабораторії'],
        count: 24,
    },
    {
        id: 'education',
        title: 'Освіта',
        titleEn: 'Education',
        icon: GraduationCap,
        photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=75',
        accent: '#3b82f6',
        bg: '#eff6ff',
        services: ['Школи', 'Університети', 'Бібліотеки', 'Курси'],
        count: 32,
    },
    {
        id: 'council',
        title: 'Міська Рада',
        titleEn: 'City Council',
        icon: Building2,
        photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&q=75',
        accent: '#f59e0b',
        bg: '#fffbeb',
        services: ['Документи', 'Дозволи', 'Реєстрація', 'Петиції'],
        count: 18,
    },
    {
        id: 'social',
        title: 'Соціальні Послуги',
        titleEn: 'Social Services',
        icon: Users,
        photo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=75',
        accent: '#8b5cf6',
        bg: '#f5f3ff',
        services: ['Допомога', 'Пільги', 'Субсидії', 'Підтримка'],
        count: 28,
    },
    {
        id: 'utilities',
        title: 'Комунальні Послуги',
        titleEn: 'Utilities',
        icon: Zap,
        photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=75',
        accent: '#10b981',
        bg: '#ecfdf5',
        services: ['Вода', 'Електрика', 'Газ', 'Опалення'],
        count: 15,
    },
    {
        id: 'business',
        title: 'Бізнес',
        titleEn: 'Business',
        icon: Briefcase,
        photo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=75',
        accent: '#06b6d4',
        bg: '#ecfeff',
        services: ['Ліцензії', 'Реєстрація', 'Підтримка', 'Звіти'],
        count: 22,
    },
    {
        id: 'transport',
        title: 'Транспорт',
        titleEn: 'Transport',
        icon: Bus,
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=75',
        accent: '#f97316',
        bg: '#fff7ed',
        services: ['Розклад', 'Парковка', 'Дороги', 'Права'],
        count: 16,
    },
    {
        id: 'emergency',
        title: 'Екстрені Служби',
        titleEn: 'Emergency',
        icon: AlertCircle,
        photo: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=600&q=75',
        accent: '#dc2626',
        bg: '#fef2f2',
        services: ['Пожежна', 'Поліція', 'Швидка', 'ДСНС'],
        count: 8,
    },
    {
        id: 'appointments',
        title: 'Онлайн Запис',
        titleEn: 'Appointments',
        icon: Calendar,
        photo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=75',
        accent: '#14b8a6',
        bg: '#f0fdfa',
        services: ['Лікарі', 'Документи', 'Консультації', 'Прийом'],
        count: 19,
    },
    {
        id: 'schools',
        title: 'Школи',
        titleEn: 'Schools',
        icon: School,
        photo: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=75',
        accent: '#6366f1',
        bg: '#eef2ff',
        services: ['Початкові', 'Середні', 'Ліцеї', 'Гімназії'],
        count: 12,
    },
    {
        id: 'kindergartens',
        title: 'Дитячі Садки',
        titleEn: 'Kindergartens',
        icon: Baby,
        photo: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?w=600&q=75',
        accent: '#ec4899',
        bg: '#fdf2f8',
        services: ['Державні', 'Приватні', 'Запис', 'Черга'],
        count: 14,
    },
    {
        id: 'hospitals',
        title: 'Медичні Заклади',
        titleEn: 'Medical',
        icon: Hospital,
        photo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=75',
        accent: '#2563eb',
        bg: '#eff6ff',
        services: ['Стаціонари', 'Амбулаторії', 'Центри', 'Диспансери'],
        count: 18,
    },
]

export const metadata: Metadata = {
    title: 'Категорії послуг | CityChe',
}

export default function CategoriesPage() {
    const totalServices = categories.reduce((s, c) => s + c.count, 0)

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

                .cat-card {
                    transition: transform .22s cubic-bezier(.4,0,.2,1),
                                box-shadow .22s cubic-bezier(.4,0,.2,1);
                }
                .cat-card:hover { transform: translateY(-5px); }
                .cat-card .card-arrow { transition: transform .2s; }
                .cat-card:hover .card-arrow { transform: translateX(4px); }
                .cat-card .card-img { transition: transform .45s cubic-bezier(.4,0,.2,1); }
                .cat-card:hover .card-img { transform: scale(1.06); }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .anim-card {
                    opacity: 0;
                    animation: fadeSlideUp .45s ease-out forwards;
                }
            `}</style>

            <div className="min-h-screen bg-[#f4f6fb] pt-24" style={{ fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── PAGE HEADER ── */}
                <div className="max-w-[1280px] mx-auto px-6 pt-7 pb-5">
                    <div className="flex items-end justify-between flex-wrap gap-5">
                        <div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 mb-2.5 text-[13px] text-slate-400">
                                <Link href="/" className="text-slate-400 no-underline hover:text-blue-600 transition-colors">
                                    Головна
                                </Link>
                                <span className="text-[10px]">›</span>
                                <span className="text-slate-800">Категорії послуг</span>
                            </div>
                            <h1
                                className="text-[clamp(26px,4vw,40px)] font-normal text-slate-900 leading-tight m-0"
                                style={{ fontFamily: "'DM Serif Display', serif" }}
                            >
                                Категорії послуг
                            </h1>
                            <p className="mt-1.5 text-[14px] text-slate-500">
                                {categories.length} категорій&nbsp;·&nbsp;{totalServices}+ послуг для мешканців Черкас
                            </p>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 min-w-[260px] shadow-sm">
                            <Search size={15} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Пошук категорії..."
                                className="border-none bg-transparent outline-none text-[14px] text-slate-800 w-full placeholder:text-slate-400"
                                style={{ fontFamily: "'DM Sans', sans-serif" }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── GRID ── */}
                <div className="max-w-[1280px] mx-auto px-6 pt-8 pb-16">
                    <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                        {categories.map((cat, idx) => {
                            const Icon = cat.icon
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/categories/${cat.id}`}
                                    className="anim-card cat-card flex flex-col bg-white rounded-2xl overflow-hidden border border-[#e8edf5] shadow-sm no-underline"
                                    style={{ animationDelay: `${idx * 45}ms` }}
                                >
                                    {/* Colour top bar */}
                                    <div className="h-1 opacity-85" style={{ background: cat.accent }} />

                                    {/* Photo */}
                                    <div className="h-[148px] overflow-hidden relative">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={cat.photo}
                                            alt={cat.title}
                                            className="card-img w-full h-full object-cover block"
                                        />
                                        {/* Count badge */}
                                        <div
                                            className="absolute top-2.5 right-2.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                                            style={{
                                                background: 'rgba(255,255,255,0.92)',
                                                backdropFilter: 'blur(6px)',
                                                color: cat.accent,
                                            }}
                                        >
                                            {cat.count} послуг
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex flex-col flex-1 px-[18px] pt-4 pb-[18px]">

                                        {/* Icon + title */}
                                        <div className="flex items-center gap-3 mb-3">
                                            <div
                                                className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                                                style={{ background: cat.bg }}
                                            >
                                                <Icon size={19} color={cat.accent} strokeWidth={1.8} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[15px] text-slate-900 m-0 leading-tight">
                                                    {cat.title}
                                                </p>
                                                <p className="text-[11px] text-slate-400 m-0 font-medium">
                                                    {cat.titleEn}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Services */}
                                        <ul className="list-none p-0 m-0 mb-4 flex flex-col gap-[5px] flex-1">
                                            {cat.services.map(s => (
                                                <li key={s} className="flex items-center gap-2 text-[13px] text-slate-600">
                                                    <span
                                                        className="w-[5px] h-[5px] rounded-full shrink-0 opacity-45"
                                                        style={{ background: cat.accent }}
                                                    />
                                                    {s}
                                                </li>
                                            ))}
                                        </ul>

                                        {/* CTA */}
                                        <div
                                            className="flex items-center gap-[5px] text-[13px] font-semibold mt-auto"
                                            style={{ color: cat.accent }}
                                        >
                                            Переглянути все
                                            <ArrowRight size={14} className="card-arrow" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}