// proxy.ts

import { NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Захист адмін-панелі
    if (pathname.startsWith('/admin') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/sign-in', req.url))
    }

    // Якщо вже залогінений — не пускаємо на сторінку входу
    if (pathname === '/auth/sign-in' && isLoggedIn) {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Сторінку реєстрації за токеном не блокуємо — вона публічна
    // /auth/register/[token] — доступна без авторизації

    return NextResponse.next()
})