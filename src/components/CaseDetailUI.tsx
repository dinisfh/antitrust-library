'use client'

import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useLanguage } from '@/i18n/LanguageContext'
import Link from 'next/link'

type CaseData = {
    title: string;
    authority: string;
    decision_date: string | null;
    created_at: string;
    industry: string;
    tags: string[];
    summary: string;
    parties_involved: string[];
    status: string;
    fine_amount: string | null;
    links: string[];
}

export default function CaseDetailUI({ caseData }: { caseData: CaseData }) {
    const { t, lang } = useLanguage()

    let displayDate = t.case_card.no_date;
    if (caseData.decision_date) {
        try {
            const dateObj = new Date(caseData.decision_date);
            if (!isNaN(dateObj.getTime())) {
                const localeStr = lang === 'pt' ? 'pt-PT' : 'en-US';
                displayDate = dateObj.toLocaleDateString(localeStr, { month: 'long', year: 'numeric' });
            } else {
                displayDate = caseData.decision_date;
            }
        } catch {
            displayDate = caseData.decision_date;
        }
    }

    return (
        <main className="max-w-4xl mx-auto py-12 px-6">
            <Link href="/" className="text-primary-blue hover:text-blue-700 hover:underline mb-8 inline-flex items-center gap-2 font-medium">
                &larr; {t.case_detail.back}
            </Link>

            <article className="bg-white rounded-2xl shadow-sm border border-light-gray p-8 md:p-12">
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className="text-xs font-bold px-3 py-1.5 bg-slate-100 text-dark-slate rounded-md tracking-wider uppercase">
                            {caseData.authority}
                        </span>
                        <span className="text-xs font-semibold text-dark-slate/60">
                            {displayDate}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-blue leading-tight mb-6">
                        {caseData.title}
                    </h1>

                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs uppercase font-bold px-3 py-1.5 bg-blue-50 text-primary-blue rounded border border-blue-100">
                            {caseData.industry}
                        </span>

                        {caseData.tags?.map((tag, i) => (
                            <span key={`tag-${i}`} className="text-xs uppercase font-bold px-3 py-1.5 bg-slate-50 text-gray-600 rounded border border-slate-200">
                                {tag}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="mb-12">
                    <h2 className="text-xl font-bold mb-6 border-b border-light-gray pb-2 text-primary-blue font-heading tracking-wide">
                        {t.case_detail.summary_title}
                    </h2>

                    <MarkdownRenderer content={caseData.summary} />
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-light-gray pt-8">
                    <div>
                        <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-3">
                            {t.case_detail.parties}
                        </h3>
                        <ul className="space-y-2">
                            {caseData.parties_involved?.map((p, i) => (
                                <li key={i} className="font-medium text-dark-slate flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-blue/30 scale-up"></span>
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-3">
                            {t.case_detail.status_fines}
                        </h3>
                        <div className="flex flex-col gap-3 items-start">
                            <span className="text-sm font-bold px-3 py-1 bg-slate-100 rounded text-dark-slate border border-light-gray uppercase">
                                {t.sidebar.status_options[caseData.status.toLowerCase() as keyof typeof t.sidebar.status_options] || caseData.status}
                            </span>
                            {caseData.fine_amount && (
                                <span className="text-sm font-bold px-3 py-1 bg-red-50 text-red-700 rounded border border-red-200 shadow-sm animate-pulse-soft">
                                    {t.case_detail.fine}: {caseData.fine_amount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-light-gray">
                    <h3 className="text-sm font-bold text-dark-slate/50 uppercase tracking-widest mb-4">
                        {t.case_detail.official_sources}
                    </h3>
                    <div className="flex flex-col gap-3">
                        {caseData.links && caseData.links.length > 0 ? (
                            caseData.links.map((link, index) => (
                                <a
                                    key={index}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-blue hover:text-blue-700 font-medium inline-flex items-center gap-2 transition-colors w-fit group"
                                >
                                    <svg className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                    {t.case_detail.source} #{index + 1}: {new URL(link).hostname.replace('www.', '')}
                                </a>
                            ))
                        ) : (
                            <p className="text-dark-slate/60 text-sm italic">{t.case_detail.no_sources}</p>
                        )}
                    </div>
                </div>
            </article>
        </main>
    )
}
