'use client'

import React, { useEffect, useState } from 'react'
import { useLanguage } from '@/i18n/LanguageContext'

export default function LanguageToggle() {
    const { lang, setLang } = useLanguage()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-8 h-8 rounded shrink-0 bg-slate-100 animate-pulse"></div>
    }

    return (
        <div
            className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 shadow-inner"
            title={lang === 'en' ? 'Mudar para Português' : 'Switch to English'}
        >
            <button
                onClick={() => setLang('en')}
                className={`flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold transition-all ${lang === 'en'
                        ? 'bg-white text-primary-blue shadow-sm ring-1 ring-slate-200/50'
                        : 'text-dark-slate/60 hover:text-dark-slate hover:bg-slate-200/50'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => setLang('pt')}
                className={`flex items-center justify-center px-2 py-1 rounded text-[10px] font-bold transition-all ${lang === 'pt'
                        ? 'bg-white text-primary-blue shadow-sm ring-1 ring-slate-200/50'
                        : 'text-dark-slate/60 hover:text-dark-slate hover:bg-slate-200/50'
                    }`}
            >
                PT
            </button>
        </div>
    )
}
