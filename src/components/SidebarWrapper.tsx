'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function SidebarWrapper({
    children,
    sidebar
}: {
    children: ReactNode,
    sidebar: ReactNode
}) {
    const pathname = usePathname();
    const showSidebar = pathname === '/';

    return (
        <div className="flex flex-1 overflow-hidden relative w-full h-full">
            {showSidebar && sidebar}
            <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/30">
                {children}
            </main>
        </div>
    );
}
