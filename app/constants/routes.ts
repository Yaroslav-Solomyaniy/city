// app/constants/routes.ts

type Route = { href: string; label: string }
type DynamicRoute<T extends string> = (param: T) => Route

export const ROUTES = {
  // Публічна частина
  HOME:       { href: '/',           label: 'Головна'    },
  CATEGORIES: { href: '/categories', label: 'Категорії'  },
  CATEGORY:   (id: string): Route => ({ href: `/categories/${id}`,       label: 'Категорія'  }),
  RESOURCES:  { href: '/resources',  label: 'Ресурси'    },
  ABOUT:      { href: '/about',      label: 'Про портал' },

  // Авторизація
  SIGN_IN:    { href: '/auth/sign-in',          label: 'Вхід'        },
  REGISTER:   (token: string): Route => ({ href: `/auth/register/${token}`, label: 'Реєстрація' }),

  // Адмін-панель
  ADMIN: {
    ROOT:           { href: '/admin',                  label: 'Адмін-панель'    },
    CATEGORIES:     { href: '/admin/categories',       label: 'Категорії'       },
    CATEGORY:       (id: string): Route => ({ href: `/admin/categories/${id}`,  label: 'Категорія'   }),
    RESOURCES:      { href: '/admin/resources',        label: 'Ресурси'         },
    ADMINISTRATORS: { href: '/admin/administrators',   label: 'Адміністратори'  },
    FEEDBACK:       { href: '/admin/feedback',         label: 'Зворотній зв\'язок' },
    LOGS:           { href: '/admin/logs',             label: 'Логи дій'        },
  },
} as const

