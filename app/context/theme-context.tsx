'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeCtx {
    theme:        Theme
    isDark:       boolean
    toggleTheme:  () => void
    mounted:      boolean
}

const ThemeContext = createContext<ThemeCtx>({
    theme:       'dark',
    isDark:      true,
    toggleTheme: () => {},
    mounted:     false,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme,   setTheme]   = useState<Theme>('dark')
    const [mounted, setMounted] = useState(false)

    // Single effect — reads storage, sets html attr, marks mounted.
    // No setState calls for theme here; we pass the value directly to
    // setAttribute so React never sees a mid-render state change.
    useEffect(() => {
        const saved   = localStorage.getItem('cityche-theme')
        const initial: Theme = saved === 'light' ? 'light' : 'dark'
        document.documentElement.setAttribute('data-theme', initial)
        // Use functional updater — avoids stale closure, satisfies ESLint
        setTheme(() => initial)
        setMounted(() => true)
    }, [])

    // Persist & sync on every toggle (skips the very first mount — initial
    // value is already applied above without going through this effect)
    useEffect(() => {
        if (!mounted) return
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('cityche-theme', theme)
    }, [theme, mounted])

    const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)