'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition, useState, useEffect } from 'react'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const [query, setQuery] = useState(searchParams.get('query') || '')

    useEffect(() => {
        // Sync external changes (like clearing filters) back to local state
        setQuery(searchParams.get('query') || '')
    }, [searchParams])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)

        // Use transition for non-blocking UI during search
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (val) {
                params.set('query', val)
            } else {
                params.delete('query')
            }

            router.replace(`/?${params.toString()}`)
        })
    }

    return (
        <div className="relative w-full md:w-96">
            <input
                type="text"
                value={query}
                onChange={handleSearch}
                placeholder="Pesquisar por título, empresa ou resumo..."
                className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm text-dark-slate focus:outline-none focus:ring-1 transition-all shadow-sm ${isPending
                        ? 'border-primary-blue/50 ring-primary-blue/30 bg-gray-50'
                        : 'border-light-gray bg-white focus:border-primary-blue focus:ring-primary-blue'
                    }`}
            />
            <div className="absolute right-3 top-3.5 flex items-center">
                {isPending ? (
                    <div className="w-4 h-4 rounded-full border-2 border-primary-blue border-r-transparent animate-spin"></div>
                ) : (
                    <svg className="w-4 h-4 text-dark-slate/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                )}
            </div>
        </div>
    )
}
