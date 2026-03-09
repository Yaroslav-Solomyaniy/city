// app/components/ui/button.tsx
import React from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'icon' | 'blue'
type Size    = 'sm' | 'md'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:     Variant
    size?:        Size
    loading?:     boolean
    loadingText?: string
    children:     React.ReactNode
}

const BASE = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer select-none'

const VARIANTS: Record<Variant, { className: string; style: React.CSSProperties }> = {
    primary: {
        className: 'btn-primary rounded-lg',
        style: {
            background: 'var(--admin-nav-active-bg)',
            color: 'var(--admin-nav-active-text)',
            border: '1px solid var(--admin-nav-active-shadow)',
        },
    },
    secondary: {
        className: 'btn-secondary rounded-lg',
        style: {
            background: 'var(--admin-stat-bg)',
            border: '1px solid var(--admin-stat-border)',
            color: 'var(--text-secondary)',
        },
    },
    danger: {
        className: 'btn-danger rounded-lg',
        style: {
            background: 'var(--admin-danger-bg)',
            color: 'var(--admin-danger-text)',
            border: '1px solid transparent',
        },
    },
    ghost: {
        className: 'btn-ghost rounded-lg',
        style: { color: 'var(--text-muted)' },
    },
    icon: {
        className: 'btn-icon rounded-lg w-8 h-8 shrink-0',
        style: { color: 'var(--text-muted)' },
    },
    blue: {
        className: 'btn-blue rounded-lg',
        style: { background: '#3b82f6', color: '#fff', border: '1px solid transparent' },
    },
}

const SIZES: Record<Size, string> = {
    sm: 'px-3 py-1.5 text-[12px] leading-none',
    md: 'px-4 py-2 text-[13px] leading-none',
}

export function Button({
                           variant     = 'primary',
                           size        = 'md',
                           loading     = false,
                           loadingText,
                           className   = '',
                           children,
                           style,
                           ...props
                       }: Props) {
    const v         = VARIANTS[variant]
    const sizeClass = variant === 'icon' ? '' : SIZES[size]

    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`${BASE} ${v.className} ${sizeClass} ${className}`}
            style={{ ...v.style, ...style }}
        >
            {loading && (
                <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
            )}
            {loading && loadingText ? loadingText : children}
        </button>
    )
}