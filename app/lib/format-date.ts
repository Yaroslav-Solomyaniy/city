export function formatLastSeen(date: Date | string | null): string {
    if (!date) return 'Ніколи'

    const d       = typeof date === 'string' ? new Date(date) : date
    const diffMs  = Date.now() - d.getTime()
    const diffMin = Math.floor(diffMs / 60_000)

    if (diffMin < 1)  return 'Щойно'
    if (diffMin < 60) return `${diffMin} хв тому`

    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24)   return `${diffH} год тому`

    const diffD = Math.floor(diffH / 24)
    if (diffD === 1)  return 'Вчора'
    if (diffD < 7)    return `${diffD} дні тому`

    return d.toLocaleDateString('uk-UA')
}