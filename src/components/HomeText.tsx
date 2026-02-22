'use client'

import { useLanguage } from '@/i18n/LanguageContext'

export function HeroText() {
    const { t } = useLanguage()
    return (
        <div>
            <h2 className="font-heading font-bold text-2xl text-dark-slate mb-1">{t.home.hero_title}</h2>
            <p className="text-sm text-dark-slate/70">{t.home.hero_subtitle}</p>
        </div>
    )
}

export function NoResultsText() {
    const { t } = useLanguage()
    return (
        <div className="col-span-full py-16 text-center bg-white rounded-xl border border-light-gray border-dashed">
            <svg className="w-12 h-12 text-dark-slate/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-lg font-bold text-dark-slate mb-1">{t.home.no_results}</h3>
            <p className="text-sm text-dark-slate/60">{t.home.no_results_desc}</p>
        </div>
    )
}
