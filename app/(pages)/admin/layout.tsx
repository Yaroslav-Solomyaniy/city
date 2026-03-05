// app/admin/layout.tsx

import React from 'react'
import AdminSidebar from '@/app/components/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex" style={{ background: 'var(--admin-page-bg)' }}>

            <AdminSidebar />

            {/* ══ MAIN CONTENT ══ */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}