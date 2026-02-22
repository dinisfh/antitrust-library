'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en, TranslationsType } from './en';
import { pt } from './pt';

type Language = 'en' | 'pt';

interface LanguageContextProps {
    lang: Language;
    setLang: (lang: Language) => void;
    t: TranslationsType;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [lang, setLangState] = useState<Language>('en'); // Default is English
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Avoid hydration mismatches by setting initial state from local storage only after mount
        const savedLang = localStorage.getItem('app-language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'pt')) {
            setLangState(savedLang);
        }
        setMounted(true);
    }, []);

    const setLang = (newLang: Language) => {
        setLangState(newLang);
        localStorage.setItem('app-language', newLang);
    };

    if (!mounted) {
        // Return a hidden or empty state to avoid Hydration Mismatch on initial load
        // But since this is a layout wrapper, returning children directly with default EN is usually fine
        // However, to be extra safe with text rendering, we just use the default state until hydrated.
    }

    const t = lang === 'pt' ? pt : en;

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
