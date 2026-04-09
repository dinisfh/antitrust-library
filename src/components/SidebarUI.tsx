'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'

type SidebarUIProps = {
    AUTHORITIES: string[]
    INDUSTRIES: string[]
    STATUSES: string[]
    TAGS: string[]
    GEOGRAPHIES: string[]
    COMPANIES: string[]
    DECADES: string[]
    TIMEFRAMES: string[]
}

export default function SidebarUI({ AUTHORITIES, INDUSTRIES, STATUSES, TAGS, GEOGRAPHIES, COMPANIES, DECADES, TIMEFRAMES }: SidebarUIProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    const { t } = useLanguage()

    // Ocultar a Sidebar se não estivermos na Homepage
    if (pathname !== '/') {
        return null;
    }

    const activeAuthorities = searchParams.get('authority')?.split(',') || []
    const activeIndustries = searchParams.get('industry')?.split(',') || []
    const activeStatuses = searchParams.get('status')?.split(',') || []
    const activeTags = searchParams.get('caseType')?.split(',') || []
    const activeGeographies = searchParams.get('geography')?.split(',') || []
    const activeCompanies = searchParams.get('company')?.split(',') || []
    const activeDecades = searchParams.get('decade')?.split(',') || []
    const activeTimeframes = searchParams.get('timeframe')?.split(',') || []

    const numActiveFilters = activeAuthorities.length + activeIndustries.length + activeStatuses.length + activeTags.length + activeGeographies.length + activeCompanies.length + activeDecades.length + activeTimeframes.length;

    const handleFilterChange = (key: string, value: string, checked: boolean, currentList: string[]) => {
        let newList = [...currentList]
        if (checked) {
            if (!newList.includes(value)) newList.push(value)
        } else {
            newList = newList.filter((v) => v !== value)
        }

        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (newList.length > 0) {
                params.set(key, newList.join(','))
            } else {
                params.delete(key)
            }
            router.replace(`/?${params.toString()}`, { scroll: false })
        })
    }

    return (
        <>
            {/* Mobile Toggle Button (Visible only on md and below) */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed bottom-6 right-6 z-40 bg-primary-blue text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center gap-2"
                aria-label="Abrir Filtros"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                {numActiveFilters > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {numActiveFilters}
                    </span>
                )}
            </button>

            {/* Mobile Backdrop overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-dark-slate/50 z-40 md:hidden transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Main Sidebar Component */}
            <aside className={`fixed md:sticky top-0 left-0 z-50 w-72 md:w-64 bg-white border-r border-light-gray h-screen flex flex-col transition-all duration-300 transform ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:shadow-none'} ${isPending ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>

                {/* Header / Actions section */}
                <div className="p-4 border-b border-light-gray flex items-center justify-between bg-slate-50 md:bg-white">
                    <h2 className="font-heading font-bold text-dark-slate text-sm uppercase tracking-wider flex items-center gap-2">
                        <svg className="w-4 h-4 md:hidden text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                        {t.sidebar.filters}
                    </h2>

                    <div className="flex items-center gap-4">
                        {numActiveFilters > 0 && (
                            <button
                                onClick={() => {
                                    const p = new URLSearchParams(searchParams.toString())
                                    p.delete('authority')
                                    p.delete('industry')
                                    p.delete('status')
                                    p.delete('caseType')
                                    p.delete('geography')
                                    p.delete('company')
                                    p.delete('decade')
                                    p.delete('timeframe')
                                    router.replace(`/?${p.toString()}`)
                                }}
                                className="text-[10px] bg-blue-50 text-primary-blue hover:bg-blue-100 uppercase font-bold px-3 py-1.5 rounded-md transition-all active:scale-95 active:bg-blue-200 shadow-sm hover:shadow inline-block"
                            >
                                {t.sidebar.reset}
                            </button>
                        )}

                        {/* Mobile Close Button */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="md:hidden text-dark-slate/60 hover:text-dark-slate p-1"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Filter Categories Container */}
                <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-24 md:pb-4">
                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.authority}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {AUTHORITIES.map((auth) => (
                                <label key={auth} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeAuthorities.includes(auth)}
                                            onChange={(e) => handleFilterChange('authority', auth, e.target.checked, activeAuthorities)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">{auth}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.geography}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {GEOGRAPHIES.map((geo) => (
                                <label key={geo} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeGeographies.includes(geo)}
                                            onChange={(e) => handleFilterChange('geography', geo, e.target.checked, activeGeographies)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">{geo}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.decade}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {DECADES.map((decade) => (
                                <label key={decade} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeDecades.includes(decade)}
                                            onChange={(e) => handleFilterChange('decade', decade, e.target.checked, activeDecades)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">{decade}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.timeframe}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {TIMEFRAMES.map((timeframe) => (
                                <label key={timeframe} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeTimeframes.includes(timeframe)}
                                            onChange={(e) => handleFilterChange('timeframe', timeframe, e.target.checked, activeTimeframes)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">
                                        {t.sidebar.timeframe_options[timeframe as keyof typeof t.sidebar.timeframe_options] || timeframe}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.status}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {STATUSES.map((status) => (
                                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeStatuses.includes(status)}
                                            onChange={(e) => handleFilterChange('status', status, e.target.checked, activeStatuses)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">
                                        {t.sidebar.status_options[status.toLowerCase() as keyof typeof t.sidebar.status_options] || status}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.tags}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {TAGS.map((tag) => (
                                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeTags.includes(tag)}
                                            onChange={(e) => handleFilterChange('caseType', tag, e.target.checked, activeTags)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">{tag}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.industry}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-52 overflow-y-auto overflow-x-hidden pr-2">
                            {INDUSTRIES.map((industry) => (
                                <label key={industry} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={activeIndustries.includes(industry)}
                                            onChange={(e) => handleFilterChange('industry', industry, e.target.checked, activeIndustries)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none">{industry}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-dark-slate mb-3 uppercase tracking-wide">{t.sidebar.company}</h3>
                        <div className="space-y-3 text-sm text-dark-slate/80 max-h-60 overflow-y-auto pr-1">
                            {COMPANIES.map((company) => (
                                <label key={company} className="flex items-start gap-3 cursor-pointer group w-full">
                                    <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                                        <input
                                            type="checkbox"
                                            checked={activeCompanies.includes(company)}
                                            onChange={(e) => handleFilterChange('company', company, e.target.checked, activeCompanies)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-white peer-checked:bg-primary-blue peer-checked:border-primary-blue peer-focus:ring-2 peer-focus:ring-primary-blue/30 transition-all duration-200 shrink-0"></div>
                                        <svg className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-dark-slate/80 group-hover:text-primary-blue transition-colors select-none break-words flex-1 leading-tight min-w-0">{company}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Apply Button Fixed at Bottom */}
                <div className="md:hidden border-t border-light-gray p-4 bg-white sticky bottom-0 z-10 w-full shadow-up">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-dark-slate text-white py-3 rounded-lg font-bold shadow-md hover:shadow-lg hover:bg-black transition-all duration-200 active:scale-95"
                    >
                        {numActiveFilters > 0 ? t.sidebar.see_results_count.replace('{{count}}', numActiveFilters.toString()) : t.sidebar.see_results}
                    </button>
                </div>
            </aside>
        </>
    )
}
