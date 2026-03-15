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
        <div className="flex w-full min-h-screen">
            {showSidebar && sidebar}
            <main className="flex-1 w-full min-w-0 p-6 md:p-8 bg-gray-50/30">
                {children}
            </main>
        </div>
    );
}
