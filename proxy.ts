import { NextResponse } from 'next/server'
import { auth } from "@/app/lib/auth"

export default auth((req) => {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.auth

    // Если пользователь идёт на страницу admin и не залогинен
    if (pathname.startsWith('/admin') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/auth/sign-in', req.url))
    }

    // Если пользователь идёт на sign-in и уже залогинен
    if (pathname.startsWith('/auth/sign-in') && isLoggedIn) {
        // перенаправляем на админку после подтверждения
        return NextResponse.redirect(new URL('/admin', req.url))
    }
    if (pathname.startsWith('/auth/verify') && isLoggedIn) {
        // перенаправляем на админку после подтверждения
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    // Для callback email, чтобы не блокировать сессию
    if (pathname.startsWith('/api/auth/callback/email')) {
        return NextResponse.next()
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/admin/:path*', '/auth/:path*', '/api/auth/callback/email'],
}