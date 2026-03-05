/* ─── Types ──────────────────────────────────────────────────── */
export interface Subcategory {
    id: string; title: string; titleEn: string
}
export interface Resource {
    id: string; title: string; description: string
    url: string; subcategoryId: string | null; tags: string[]; createdAt: string
}


export interface Category {
    id: string;
    title: string;
    titleEn: string
    iconName: string;
    photo: string;
    accent: string;
    bg: string
    services: string[];
    subcategories: Subcategory[];
    resources: Resource[]
    createdAt: string
}
/* ─── Mock data ──────────────────────────────────────────────── */

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'health', title: "Здоров'я", titleEn: 'Health', iconName: 'Heart',
        photo: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&q=50',
        accent: '#ef4444', bg: '#fef2f2',
        services: ['Лікарні', 'Поліклініки', 'Аптеки', 'Лабораторії'],
        subcategories: [
            {id: 'hospitals-sub', title: 'Лікарні', titleEn: 'Hospitals'},
            {id: 'pharmacies', title: 'Аптеки', titleEn: 'Pharmacies'},
        ],
        resources: [
            {
                id: 'r1',
                title: 'Черкаська обласна лікарня',
                description: 'Головний медичний заклад області',
                url: 'https://oblhos.ck.ua',
                subcategoryId: 'hospitals-sub',
                tags: ['лікарня'],
                createdAt: '2025-01-10'
            },
            {
                id: 'r2',
                title: 'Довідник аптек',
                description: 'Список аптек міста з адресами',
                url: 'https://apteka.ck.ua',
                subcategoryId: 'pharmacies',
                tags: ['аптека'],
                createdAt: '2025-01-15'
            },
            {
                id: 'r3',
                title: 'Запис до лікаря онлайн',
                description: 'Портал онлайн-запису',
                url: 'https://helsi.me',
                subcategoryId: null,
                tags: ['онлайн'],
                createdAt: '2025-02-01'
            },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'education', title: 'Освіта', titleEn: 'Education', iconName: 'GraduationCap',
        photo: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=50',
        accent: '#3b82f6', bg: '#eff6ff',
        services: ['Школи', 'Університети', 'Бібліотеки', 'Курси'],
        subcategories: [
            {id: 'schools-sub', title: 'Школи', titleEn: 'Schools'},
            {id: 'universities', title: 'Університети', titleEn: 'Universities'},
        ],
        resources: [
            {
                id: 'r4',
                title: 'ЧНУ ім. Хмельницького',
                description: 'Офіційний сайт університету',
                url: 'https://cnu.edu.ua',
                subcategoryId: 'universities',
                tags: ['університет'],
                createdAt: '2025-01-05'
            },
            {
                id: 'r5',
                title: 'НВК №1',
                description: 'Навчально-виховний комплекс',
                url: 'https://nvk1.ck.ua',
                subcategoryId: 'schools-sub',
                tags: ['школа'],
                createdAt: '2025-01-20'
            },
        ],
        createdAt: '2024-10-15',
    },
    {
        id: 'council', title: 'Міська Рада', titleEn: 'City Council', iconName: 'Building2',
        photo: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=50',
        accent: '#f59e0b', bg: '#fffbeb',
        services: ['Документи', 'Дозволи', 'Реєстрація', 'Петиції'],
        subcategories: [{id: 'docs', title: 'Документи', titleEn: 'Documents'}],
        resources: [
            {
                id: 'r6',
                title: 'Сайт міської ради',
                description: 'Новини, рішення ради',
                url: 'https://mrada.ck.ua',
                subcategoryId: null,
                tags: ['рада'],
                createdAt: '2024-11-01'
            },
        ],
        createdAt: '2024-10-20',
    },
    {
        id: 'social', title: 'Соціальні Послуги', titleEn: 'Social Services', iconName: 'Users',
        photo: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=50',
        accent: '#8b5cf6', bg: '#f5f3ff',
        services: ['Допомога', 'Пільги', 'Субсидії', 'Підтримка'],
        subcategories: [], resources: [], createdAt: '2024-11-01',
    },
    {
        id: 'utilities', title: 'Комунальні Послуги', titleEn: 'Utilities', iconName: 'Zap',
        photo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&q=50',
        accent: '#10b981', bg: '#ecfdf5',
        services: ['Вода', 'Електрика', 'Газ', 'Опалення'],
        subcategories: [
            {id: 'water', title: 'Водопостачання', titleEn: 'Water'},
            {id: 'electricity', title: 'Електропостачання', titleEn: 'Electricity'},
        ],
        resources: [
            {
                id: 'r7',
                title: 'Черкасиводоканал',
                description: 'Водопостачання та водовідведення',
                url: 'https://vodokanal.ck.ua',
                subcategoryId: 'water',
                tags: ['вода'],
                createdAt: '2024-12-10'
            },
        ],
        createdAt: '2024-11-05',
    },
    {
        id: 'transport', title: 'Транспорт', titleEn: 'Transport', iconName: 'Bus',
        photo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=50',
        accent: '#f97316', bg: '#fff7ed',
        services: ['Розклад', 'Парковка', 'Дороги', 'Права'],
        subcategories: [{id: 'buses', title: 'Автобуси', titleEn: 'Buses'}],
        resources: [
            {
                id: 'r8',
                title: 'Розклад маршрутів',
                description: 'Актуальний розклад транспорту',
                url: 'https://marshrutky.ck.ua',
                subcategoryId: 'buses',
                tags: ['маршрут'],
                createdAt: '2025-01-08'
            },
        ],
        createdAt: '2024-11-15',
    },
    {
        id: 'emergency', title: 'Екстрені Служби', titleEn: 'Emergency', iconName: 'AlertCircle',
        photo: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=400&q=50',
        accent: '#dc2626', bg: '#fef2f2',
        services: ['Пожежна', 'Поліція', 'Швидка', 'ДСНС'],
        subcategories: [], resources: [], createdAt: '2024-11-20',
    },
]