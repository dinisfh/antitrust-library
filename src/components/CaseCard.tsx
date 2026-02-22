'use client'

import { type CaseMatch } from '@/app/actions'
import Link from 'next/link'
import { useLanguage } from '@/i18n/LanguageContext'

// Remove tags mais comuns de Markdown p/ apresentar plain text nos Cards
const stripMarkdown = (md: string) => {
    if (!md) return '';
    return md
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks / mermaid
        .replace(/#{1,6}\s?/g, '')      // Remove headers
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bolds
        .replace(/(\*|_)(.*?)\1/g, '$2')    // Remove italics
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Reter link text
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .replace(/\n+/g, ' ') // Replace newlines in text blocks
        .replace(/\s{2,}/g, ' ') // Collapse spaces
        .trim();
};

export default function CaseCard({ data }: { data: CaseMatch }) {
    const { t, lang } = useLanguage();

    // Datas apenas com Mês extenso e Ano para poupar espaço
    let displayDate = t.case_card.no_date;
    if (data.decision_date) {
        try {
            const dateObj = new Date(data.decision_date);
            if (!isNaN(dateObj.getTime())) {
                const localeStr = lang === 'pt' ? 'pt-PT' : 'en-US';
                displayDate = dateObj.toLocaleDateString(localeStr, { month: 'long', year: 'numeric' });
            } else {
                displayDate = data.decision_date;
            }
        } catch {
            displayDate = data.decision_date;
        }
    }

    return (
        <Link href={`/cases/${data.id}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary-blue rounded-xl">
            <div className="bg-white rounded-xl border border-light-gray p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full group">
                <div className="flex justify-between items-start mb-4 gap-2">
                    <span className="text-[11px] font-bold px-2 py-1 bg-slate-100 text-dark-slate rounded tracking-wide truncate">
                        {data.authority}
                    </span>
                    <span className="text-[11px] font-semibold text-dark-slate/60 whitespace-nowrap">
                        {displayDate}
                    </span>
                </div>

                <h3 className="font-heading font-bold text-lg text-primary-blue mb-3 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2" title={data.title}>
                    {data.title}
                </h3>

                <p className="text-sm text-dark-slate/80 line-clamp-3 mb-5 flex-1 leading-relaxed">
                    {stripMarkdown(data.summary)}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-blue-50 text-primary-blue rounded border border-blue-100 truncate max-w-[120px]">
                        {data.industry}
                    </span>

                    {data.tags && data.tags.slice(0, 2).map((tag, i) => (
                        <span key={`tag-${i}`} className="text-[10px] uppercase font-bold px-2 py-0.5 bg-slate-50 text-gray-600 rounded border border-slate-200 truncate max-w-[120px]">
                            {tag}
                        </span>
                    ))}

                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${data.status.toLowerCase().includes('closed') || data.status.toLowerCase().includes('decidido') || data.status.toLowerCase().includes('fined')
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : data.status.toLowerCase().includes('appeal')
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-50 text-dark-slate border-light-gray'
                        }`}>
                        {t.sidebar.status_options[data.status.toLowerCase() as keyof typeof t.sidebar.status_options] || data.status}
                    </span>

                    {data.fine_amount ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-red-50 text-red-700 rounded border border-red-200">
                            {data.fine_amount}
                        </span>
                    ) : null}
                </div>

                <div className="pt-4 border-t border-light-gray flex flex-wrap items-center gap-4">
                    {data.links && data.links.length > 0 ? (
                        data.links.slice(0, 2).map((linkUrl, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    window.open(linkUrl, '_blank', 'noopener,noreferrer')
                                }}
                                className="text-[11px] font-semibold text-primary-blue hover:text-blue-700 hover:underline flex items-center gap-1 transition-colors uppercase tracking-wide appearance-none bg-transparent p-0 m-0 border-none"
                            >
                                {new URL(linkUrl).hostname.replace('www.', '')} &rarr;
                            </button>
                        ))
                    ) : (
                        <span className="text-[11px] font-semibold text-dark-slate/50 uppercase tracking-wide">
                            {t.case_card.no_sources}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}
