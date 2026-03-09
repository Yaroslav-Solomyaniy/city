// app/components/ui/breadcrumb.tsx
interface BreadcrumbItem {
    label: string
    href?: string
}

interface Props {
    items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: Props) {
    return (
        <div className="flex items-center gap-2 mb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            {items.map((item, i) => (
                <span key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-[10px]">›</span>}
                    {item.href ? (
                        <a href={item.href} style={{ color: 'var(--text-muted)' }}>
                            {item.label}
                        </a>
                    ) : (
                        <span style={{ color: i === items.length - 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </div>
    )
}