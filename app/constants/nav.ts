// app/constants/nav.ts

export type NavLink = { href: string; label: string }

export const NAV_LINKS: readonly NavLink[] = [
  { href: '/',           label: 'Головна'    },
  { href: '/categories', label: 'Категорії'  },
  { href: '/resources',  label: 'Ресурси'    },
  { href: '/about',      label: 'Про портал' },
] as const