'use client'

export default function AdminError({ error, reset }: {
    error: Error
    reset: () => void
}) {
    return (
        <div>
            <p>Щось пішло не так</p>
            <button onClick={reset}>Спробувати знову</button>
        </div>
    )
}