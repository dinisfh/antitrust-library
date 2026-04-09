'use client'

import MarkdownRenderer from '@/components/MarkdownRenderer'
import { useLanguage } from '@/i18n/LanguageContext'
import Link from 'next/link'

type CaseData = {
    title: string;
    authority: string;
    decision_date: string | null;
    start_date: string | null;
    created_at: string;
    industry: string;
    tags: string[];
    summary: string;
    parties_involved: string[];
    status: string;
    fine_amount: string | null;
    links: string[];
    // New fields
    outcome?: string;
    market?: string;
    conduct?: string;
    theory_of_harm?: string;
    economics_issues?: string;
    decision?: string;
    is_favorite?: boolean | null;
}

const Card = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={`bg-[#DBF3FA] rounded-xl p-6 md:p-8 flex flex-col ${className}`}>
        <h2 className="text-xl md:text-2xl font-bold mb-4 font-heading text-dark-slate border-b-2 border-primary-blue/20 pb-2">
            {title}
        </h2>
        <div className="flex-grow text-dark-slate/80 prose prose-sm prose-slate max-w-none">
            {children}
        </div>
    </div>
);

export default function CaseDetailUI({ caseData }: { caseData: CaseData }) {
    const { t, lang } = useLanguage()

    let displayDate = t.case_card.no_date;
    
    const formatDateStr = (dateStr: string) => {
        try {
            const dateObj = new Date(dateStr);
            if (!isNaN(dateObj.getTime())) {
                const localeStr = lang === 'pt' ? 'pt-PT' : 'en-US';
                return dateObj.toLocaleDateString(localeStr, { month: 'long', year: 'numeric' });
            }
        } catch {}
        return dateStr;
    }

    if (caseData.start_date || caseData.decision_date) {
        if (caseData.start_date && caseData.decision_date) {
            displayDate = `${formatDateStr(caseData.start_date)} — ${formatDateStr(caseData.decision_date)}`;
        } else if (caseData.decision_date) {
            displayDate = `${lang === 'pt' ? 'Decisão:' : 'Decision:'} ${formatDateStr(caseData.decision_date)}`;
        } else if (caseData.start_date) {
            displayDate = `${lang === 'pt' ? 'Início:' : 'Start:'} ${formatDateStr(caseData.start_date)}`;
        }
    }

    return (
        <main className="max-w-5xl mx-auto py-12 px-6">
            <Link href="/" className="text-primary-blue hover:text-blue-700 hover:underline mb-8 inline-flex items-center gap-2 font-medium">
                &larr; {t.case_detail.back}
            </Link>

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-dark-slate leading-tight mb-4 flex items-center flex-wrap gap-2 md:gap-3">
                {caseData.is_favorite && (
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                )}
                <span>{caseData.title}</span>
            </h1>
            


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                {/* Overview Card */}
                <Card title="Overview:">
                    <MarkdownRenderer content={`- **Case**: ${caseData.title}\n- **Authority**: ${caseData.authority}\n- **Decision**: ${displayDate}\n${caseData.outcome ? `- **Outcome**: ${caseData.outcome}` : ''}`} />
                </Card>

                {/* Market Card */}
                <Card title="Market:">
                    <MarkdownRenderer content={caseData.market || "No data provided."} />
                </Card>

                {/* Conduct Card */}
                <Card title="Conduct:">
                    <MarkdownRenderer content={caseData.conduct || "No data provided."} />
                </Card>

                {/* Theory of Harm Card */}
                <Card title="Theory of Harm:">
                    <MarkdownRenderer content={caseData.theory_of_harm || "No data provided."} />
                </Card>

                {/* Economics Issues Card */}
                <Card title="Economics Issues:">
                    <MarkdownRenderer content={caseData.economics_issues || "No data provided."} />
                </Card>

                {/* Decision Card */}
                <Card title="Decision:">
                    <MarkdownRenderer content={caseData.decision || "No data provided."} />
                    {caseData.fine_amount && (
                        <div className="mt-4 inline-block font-bold px-3 py-1 bg-red-50 text-red-700 rounded border border-red-200">
                            {t.case_detail.fine}: {caseData.fine_amount}
                        </div>
                    )}
                </Card>
            </div>

            {/* Sources Card (Full Width) */}
            <Card title="Sources:" className="w-full">
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
                        <p className="italic font-medium">{t.case_detail.no_sources}</p>
                    )}
                </div>
            </Card>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-light-gray pt-6">
                {/* Meta details like tags and industry for visual context at bottom */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase font-bold px-3 py-1.5 bg-blue-50 text-primary-blue rounded border border-blue-100">
                        {caseData.industry}
                    </span>
                    {caseData.tags?.map((tag, i) => (
                        <span key={`tag-${i}`} className="text-xs uppercase font-bold px-3 py-1.5 bg-slate-50 text-gray-600 rounded border border-slate-200">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </main>
    )
}
